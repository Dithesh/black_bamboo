import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmPopupComponent } from 'src/app/shared/components/confirm-popup/confirm-popup.component';
import { SnackService } from 'src/app/shared/services/snack.service';
import { FormGroup, FormBuilder, FormArray, AbstractControl } from '@angular/forms';
import { DataService } from 'src/app/shared/services/data.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {
  form: FormGroup;
  displayedColumns: string[] = ['ordertype', 'price', 'taxPercent', 'packagingCharges'];
  dataSource = new BehaviorSubject<AbstractControl[]>([]);;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  orderTypes: any[];
  constructor(
    private _snackBar: MatSnackBar, 
    private dialog:MatDialog, 
    private _serv: DataService,
    private fb: FormBuilder
    ) { 
      this.form = this.fb.group({
        id: [''],
        productNumber: [''],
        productName: [''],
        description: [''],
        featuredImage: [''],
        price: [''],
        taxPercent: [''],
        packagingCharges: [''],
        isActive: [''],
        branch_id: [''],
        isOrderTypePricing: [''],
        isVeg: [''],
        orderBasedPrice: this.fb.array([]),
      })
    }

  ngOnInit(): void {
    this.getOrderTypes();
  }

  get orderBasedPrice() {
    return this.form.get('orderBasedPrice') as FormArray;
  }

  getOrderTypes() {
    this._serv.endpoint = "order-manager/order-type?fields=id,typeName";
    this._serv.get().subscribe(response => {
      this.orderTypes = response as any[];
      this.orderTypes.forEach(elem => {
        this.orderBasedPrice.push(this.fb.group({
          id: [''],
          price: [''],
          taxPercent: [''],
          packagingCharges: [''],
          orderTypeId: [elem.id],
          orderTypeName: [elem.typeName]
        }));
        this.dataSource.next(this.orderBasedPrice.controls);
      })
    })
  }


}
