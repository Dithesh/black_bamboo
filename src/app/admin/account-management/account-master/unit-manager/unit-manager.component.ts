import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ConfirmPopupComponent } from 'src/app/shared/components/confirm-popup/confirm-popup.component';
import { DataService } from 'src/app/shared/services/data.service';
import { MasterGlobalService } from '../services/master-global.service';

@Component({
  selector: 'app-unit-manager',
  templateUrl: './unit-manager.component.html',
  styleUrls: ['./unit-manager.component.scss']
})
export class UnitManagerComponent implements OnInit, OnDestroy {
  companyList;
  userData;
  selectedCompany = new FormControl('');
  addButtonSubscriber;
  unitList:any[] = [];
  // branchList:any[] = [];
  addUnitActive = false;
  editUnitIndex;
  selectedCompanySubscriber: any;
  previousUnitData: any;

  constructor(
    private _global: MasterGlobalService,
    private _serv: DataService,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) { 
    this.userData = this._serv.getUserData();
    this.route.parent.data.subscribe(response => {
      this.companyList = response.companyList;
      if(this.companyList.length > 0)
        this.selectedCompany.setValue(this.companyList[0].id)
    })
  }

  ngOnInit(): void {
    this.addButtonSubscriber = this._global.unitAdd.subscribe(response => {
      if(response) {
        this.addAnotherUnit();
      }
    })
    this.selectedCompanySubscriber = this.selectedCompany.valueChanges.subscribe(response => {
      this.getAllUnits();
      // this.getAllBranches();
    })
    // this.getAllBranches();
    this.getAllUnits();

  }

  // getAllBranches() {
  //   this._serv.endpoint = "order-manager/branch?status=active&companyId="+this.selectedCompany.value;
  //   this._serv.get().subscribe((response:any[]) => {
  //     this.branchList = response;     
  //   })
  // }

  getAllUnits() {
    this.unitList=[];
    this.addUnitActive=false;
    this._serv.endpoint = "account-manager/unit?companyId="+this.selectedCompany.value;
    this._serv.get().subscribe((response:any[]) => {
      this.unitList = response;
      if(this.unitList.length == 0) {
        this.addUnitActive=true;
      }      
      this.addNewUnit();
    })
  }

  addAnotherUnit() {
    if(!this.addUnitActive && !this.editUnitIndex) {
      this.addUnitActive=true;
    }
  }

  onUnitEdit(index) {
    this.addUnitActive=false;
    this.editUnitIndex = index;
    this.previousUnitData = {...this.unitList[index]};
  }

  onCancelEdit() {
    if(this._serv.notNull(this.editUnitIndex)) {
      this.unitList[this.editUnitIndex] = this.previousUnitData;
      this.previousUnitData=undefined;
      this.editUnitIndex = undefined;
    }else {
      this.addUnitActive=false;
    }
  }

  addNewUnit() {
    this.unitList.unshift({
      id: '',
      unitLabel: '',
      description: '',
      isActive: true,
      // branchId: '',
      companyId: ''
    })
  }

  saveUnit(item) {
    item.company_id = this.selectedCompany.value;
    this._serv.endpoint="account-manager/unit";
    this._serv.post(item).subscribe((response:any) => {
      this.addUnitActive=false;
      this.editUnitIndex=undefined;
      this.previousUnitData=undefined;
      let message = item.unitLabel + ' updated successfully';
      if(item.id == ""){
        this.addNewUnit();
        message = item.unitLabel + ' added successfully';
      }
      item.id = response.id;
      // item.branch = response.branch;

      this._serv.showMessage(message, 'success');
    }, ({error}) => {
      if(error.hasOwnProperty('msg')) {
        this._serv.showMessage(error.msg, 'error');
      }else {
        this._serv.showMessage('Something went wrong. Please contact administator', 'error');
      }
    })
  }

  deleteUnit(index) {

    let item = this.unitList[index];
    let dialogRef = this.dialog.open(ConfirmPopupComponent);
    dialogRef.afterClosed().subscribe(data => {
      if(data) {
        this._serv.endpoint = "account-manager/unit/"+item.id;
        this._serv.delete().subscribe(response => {
          this._serv.showMessage(item.unitLabel + " deleted successfully", 'success');
          this.unitList.splice(index, 1);
          if(this.unitList.length <= 1) {
            this.addUnitActive=true;
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
