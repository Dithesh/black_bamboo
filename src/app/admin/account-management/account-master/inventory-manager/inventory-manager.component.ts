import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ConfirmPopupComponent } from 'src/app/shared/components/confirm-popup/confirm-popup.component';
import { DataService } from 'src/app/shared/services/data.service';
import { MasterGlobalService } from '../services/master-global.service';

@Component({
  selector: 'app-inventory-manager',
  templateUrl: './inventory-manager.component.html',
  styleUrls: ['./inventory-manager.component.scss']
})
export class InventoryManagerComponent implements OnInit {
  companyList;
  unitList;
  selectedCompany = new FormControl('');
  addButtonSubscriber;
  inventoryList:any[] = [];
  // branchList:any[] = [];
  addInventoryActive = false;
  editInventoryIndex;
  selectedCompanySubscriber: any;
  previousInventoryData: any;

  constructor(
    private _global: MasterGlobalService,
    private _serv: DataService,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) { 
    this.route.parent.data.subscribe(response => {
      this.companyList = response.companyList;
      if(this.companyList.length > 0)
        this.selectedCompany.setValue(this.companyList[0].id)
    })
  }

  ngOnInit(): void {
    this.addButtonSubscriber = this._global.inventoryAdd.subscribe(response => {
      if(response) {
        this.addAnotherInventory();
      }
    })
    this.selectedCompanySubscriber = this.selectedCompany.valueChanges.subscribe(response => {
      this.getAllInventorys();
    })
    this.getAllInventorys();

  }

  getAllInventorys() {
    this.inventoryList=[];
    this.addInventoryActive=false;
    this.getAllUnits();
    this._serv.endpoint = "account-manager/inventory?companyId="+this.selectedCompany.value;
    this._serv.get().subscribe((response:any[]) => {
      this.inventoryList = response;
      if(this.inventoryList.length == 0) {
        this.addInventoryActive=true;
      }      
      this.addNewInventory();
    })
  }

  
  getAllUnits() {
    this.unitList=[];
    this._serv.endpoint = "account-manager/unit?companyId="+this.selectedCompany.value;
    this._serv.get().subscribe((response:any[]) => {
      this.unitList = response;
    })
  }

  addAnotherInventory() {
    if(!this.addInventoryActive && !this.editInventoryIndex) {
      this.addInventoryActive=true;
    }
  }

  onInventoryEdit(index) {
    this.addInventoryActive=false;
    this.editInventoryIndex = index;
    this.previousInventoryData = {...this.inventoryList[index]};
  }

  onCancelEdit() {
    if(this._serv.notNull(this.editInventoryIndex)) {
      this.inventoryList[this.editInventoryIndex] = this.previousInventoryData;
      this.previousInventoryData=undefined;
      this.editInventoryIndex = undefined;
    }else {
      this.addInventoryActive=false;
    }
  }

  addNewInventory() {
    this.inventoryList.unshift({
      id: '',
      itemName: '',
      pricePerUnit: '',
      description: '',
      isActive: true,
      company_id: ''
    })
  }

  saveInventory(item) {
    item.company_id = this.selectedCompany.value;
    this._serv.endpoint="account-manager/inventory";
    this._serv.post(item).subscribe((response:any) => {
      this.addInventoryActive=false;
      this.editInventoryIndex=undefined;
      this.previousInventoryData=undefined;
      let message = item.itemName + ' updated successfully';
      if(item.id == ""){
        this.addNewInventory();
        message = item.itemName + ' added successfully';
      }
      item.id = response.id;
      item.unit = response.unit;

      this._serv.showMessage(message, 'success');
    }, ({error}) => {
      if(error.hasOwnProperty('msg')) {
        this._serv.showMessage(error.msg, 'error');
      }else {
        this._serv.showMessage('Something went wrong. Please contact administator', 'error');
      }
    })
  }

  deleteInventory(index) {

    let item = this.inventoryList[index];
    let dialogRef = this.dialog.open(ConfirmPopupComponent);
    dialogRef.afterClosed().subscribe(data => {
      if(data) {
        this._serv.endpoint = "account-manager/inventory/"+item.id;
        this._serv.delete().subscribe(response => {
          this._serv.showMessage(item.inventoryName + " deleted successfully", 'success');
          this.inventoryList.splice(index, 1);
          if(this.inventoryList.length <= 1) {
            this.addInventoryActive=true;
          }
        }, ({error}) => {
          this._serv.showMessage(error['msg'], 'error');
        })
      }
    })
  }

  ngOnDestroy() {
    this._global.unitAdd.next(false);
    if(this.addButtonSubscriber) {
      this.addButtonSubscriber.unsubscribe();
    }
    if(this.selectedCompanySubscriber) {
      this.selectedCompanySubscriber.unsubscribe();
    }
  }

}