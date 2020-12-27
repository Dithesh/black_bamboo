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
  userData;
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
    this.userData = this._serv.getUserData();
    this.route.parent.parent.data.subscribe(response => {
      this.companyList = response.companyList;
      if(this.companyList.length > 0)
        this.selectedCompany.setValue(this.companyList[0].id)
    })
  }

  ngOnInit(): void {
   
    this.selectedCompanySubscriber = this.selectedCompany.valueChanges.subscribe(response => {
      this.getAllInventorys();
    })
    this.getAllInventorys();

  }

  getAllInventorys() {
    this.inventoryList=[];
    this.addInventoryActive=false;
    this._serv.endpoint = "account-manager/inventory?companyId="+this.selectedCompany.value;
    this._serv.get().subscribe((response:any[]) => {
      this.inventoryList = response;
      if(this.inventoryList.length == 0) {
        this.addInventoryActive=true;
      }      
      // this.addNewInventory();
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
    if(this.selectedCompanySubscriber) {
      this.selectedCompanySubscriber.unsubscribe();
    }
  }

}