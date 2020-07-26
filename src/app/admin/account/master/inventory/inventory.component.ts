import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { DataService } from 'src/app/shared/services/data.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmPopupComponent } from 'src/app/shared/components/confirm-popup/confirm-popup.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit {
  form: FormGroup;
  editIndex: any;
  unitList: any[] =[];
  constructor(
    private fb: FormBuilder,
    private _serv: DataService,
    private dialog: MatDialog,
    private route:ActivatedRoute
  ) { 
    this.form = this.fb.group({
      inventories: this.fb.array([]),
      newInventories: this.fb.array([]),
    })
    this.route.data.subscribe((response:any) => {
      this.getAllUnits(response.units);
    })
  }

  ngOnInit(): void {
    this.getAllInventories();
  }

  getAllUnits(list) {
    this.unitList = list;
  }

  get inventories() {
    return this.form.get('inventories') as FormArray;
  }

  get newInventories() {
    return this.form.get('newInventories') as FormArray;
  }

  getAllInventories() {
    this.inventories.controls = [];
    this.inventories.reset();
    this._serv.endpoint = "account-manager/inventory";
    this._serv.get().subscribe((response: any[]) => {
      response.forEach(elem => {
        let form = this.newInventory();
        form.patchValue(elem);
        this.inventories.push(form)
      })
      if(response.length == 0){
        this.newInventories.push(this.newInventory());
      }
    })
  }

  addNewInventory() {
    this.newInventories.push(this.newInventory());
  }

  removeNewInventory(index) {
    this.newInventories.removeAt(index);
  }

  newInventory() {
    return this.fb.group({
      id: [''],
      itemName: ['', [Validators.required]],
      unitId: ['', [Validators.required]],
      description: [''],
      pricePerUnit: ['0'],
      isActive: [true],
    });
  }

  saveInventory(inventoryForm: FormGroup, index=null) {
    inventoryForm.markAllAsTouched();
    if(inventoryForm.invalid)return;
    let data = {...inventoryForm.value};

    
    let api=null;
    this._serv.endpoint="account-manager/inventory";
    if(data.id == "") {
      api = this._serv.post(data);
    }else {
      this._serv.endpoint+="/"+data.id;
      api = this._serv.put(data);
    }
    api.subscribe(response => {
      if(data.id == "" && index != null) {
        this.newInventories.removeAt(index);
        this.getAllInventories();
      }else {
        this.editIndex=undefined;
      }
    })
  }

  onEditClick(index) {
    this.editIndex= index;
  }

  deleteInventory(index) {
    let item = this.inventories.controls[index].value;
    let dialogRef = this.dialog.open(ConfirmPopupComponent);
    dialogRef.afterClosed().subscribe(data => {
      if(data) {
        this._serv.endpoint = "account-manager/inventory/"+item.id;
        this._serv.delete().subscribe(response => {
          this._serv.showMessage("Inventory deleted successfully", 'success');
          this.inventories.removeAt(index);
        }, ({error}) => {
          this._serv.showMessage(error['msg'], 'error');
        })
      }
    })
  }

}
