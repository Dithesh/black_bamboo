import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DataService } from 'src/app/shared/services/data.service';
import { Observable } from 'rxjs';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { startWith, map } from 'rxjs/operators';
import { MatChipInputEvent } from '@angular/material/chips';

@Component({
  selector: 'app-add-order-item',
  templateUrl: './add-order-item.component.html',
  styleUrls: ['./add-order-item.component.scss']
})
export class AddOrderItemComponent implements OnInit {
  form: FormGroup;
  productList: any[]=[];
  filteredProductList: Observable<any[]>;
  orderItems=[];
  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];

  @ViewChild('itemInput') itemInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;
  constructor(
    @Inject(MAT_DIALOG_DATA) private data, 
    private dialogRef: MatDialogRef<AddOrderItemComponent>,
    private fb: FormBuilder,
    private _serv: DataService
  ) { 
    this.form = this.fb.group({
      orderItemName: [''],
      isParcel: [false]
    })
  }

  ngOnInit(): void {
    this.getAllProducts();
  }

  adOrderItem() {
    if(this.orderItems.length <= 0) {
      this._serv.showMessage('Please select items.', 'error');
      return;
    }
    this.dialogRef.close({
      items: this.orderItems,
      isParcel: this.form.get('isParcel').value
    });
  }

  close() {
    this.dialogRef.close();
  }


  getAllProducts() {
    this._serv.endpoint = "order-manager/product?status=active&needPricing=detailed&stockStatus=in-stock";
    this._serv.get().subscribe(response => {
      this.productList = response as any[];
      this.filteredProductList = this.form.get('orderItemName').valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value))
      );
    })
  }

  private _filter(value: any): any[] {
    if(!this._serv.notNull(value))return this.productList;
    
    let filterValue = "";
    if(value instanceof Object) {
      filterValue = value.productName.toLowerCase();
    }else {
      filterValue = value.toLowerCase();
    }

    return this.productList.filter(option => (option.productName.toLowerCase().indexOf(filterValue) === 0));
  }


  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value:any = event.value;

    // Add our fruit
    if (value instanceof Object && this.orderItems.indexOf(value) < 0) {
      this.orderItems.push(value);
    }else {
      this._serv.showMessage('Item already selected.', 'error');
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.form.get('orderItemName').setValue(null);
  }

  remove(item: string): void {
    const index = this.orderItems.indexOf(item);

    if (index >= 0) {
      this.orderItems.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    let value = event.option.value
    if (value instanceof Object && this.orderItems.indexOf(value) < 0) {
      this.orderItems.push(value);
    } else {
      this._serv.showMessage('Item already selected.', 'error');
    }
    this.itemInput.nativeElement.value = '';
    this.form.get('orderItemName').setValue(null);
  }

}
