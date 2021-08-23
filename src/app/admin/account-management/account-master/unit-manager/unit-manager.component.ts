import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ConfirmPopupComponent } from 'src/app/shared/components/confirm-popup/confirm-popup.component';
import { DataService } from 'src/app/shared/services/data.service';
import { MasterGlobalService } from '../../services/master-global.service';

@Component({
  selector: 'app-unit-manager',
  templateUrl: './unit-manager.component.html',
  styleUrls: ['./unit-manager.component.scss']
})
export class UnitManagerComponent implements OnInit, OnDestroy {
  companyList;
  branchList: any[] = [];
  userData;
  selectedCompany = new FormControl('');
  selectedBranch = new FormControl('');
  addButtonSubscriber;
  unitList: any[] = [];
  // branchList:any[] = [];
  addUnitActive = false;
  editUnitIndex;
  selectedCompanySubscriber: any;
  selectedBranchSubscriber: any;
  previousUnitData: any;

  constructor(
    private global: MasterGlobalService,
    private serv: DataService,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {
    this.userData = this.serv.getUserData();
    if (this.userData.roles === 'Super Admin') {
    this.route.parent.data.subscribe(response => {
      this.companyList = response.companyList;
      if (this.companyList.length > 0) {
        this.selectedCompany.setValue(this.companyList[0].id);
        this.getAllBranches();
      }
    });
    } else if (this.userData.roles === 'Company Admin') {
      this.selectedCompany.setValue(this.userData.company_id);
      this.getAllBranches();
    }else {
      this.selectedCompany.setValue(this.userData.company_id);
      this.selectedBranch.setValue(this.userData.branch_id);
      this.getAllUnits();
    }
  }

  ngOnInit(): void {
    this.addButtonSubscriber = this.global.unitAdd.subscribe(response => {
      if (response) {
        this.addAnotherUnit();
      }
    });
    this.selectedCompanySubscriber = this.selectedCompany.valueChanges.subscribe(response => {
      this.selectedBranch.setValue('', {emitEvent: false});
      this.branchList = [];
      this.getAllBranches();
    });
    this.selectedBranchSubscriber = this.selectedBranch.valueChanges.subscribe(response => {
      this.getAllUnits();
    });
    // this.getAllUnits();

  }

  getAllBranches() {
    this.serv.endpoint = 'order-manager/branch?status=active&companyId=' + this.selectedCompany.value;
    this.serv.get().subscribe((response: any[]) => {
      this.branchList = response;
    });
  }

  getAllUnits() {
    this.unitList = [];
    this.addUnitActive = false;
    this.serv.endpoint = 'account-manager/unit?branch_id=' + this.selectedBranch.value;
    this.serv.get().subscribe((response: any[]) => {
      this.unitList = response;
      if (this.unitList.length === 0) {
        this.addUnitActive = true;
      }
      this.addNewUnit();
    });
  }

  addAnotherUnit() {
    if (!this.addUnitActive && !this.editUnitIndex) {
      this.addUnitActive = true;
    }
  }

  onUnitEdit(index) {
    this.addUnitActive = false;
    this.editUnitIndex = index;
    this.previousUnitData = {...this.unitList[index]};
  }

  onCancelEdit() {
    if (this.serv.notNull(this.editUnitIndex)) {
      this.unitList[this.editUnitIndex] = this.previousUnitData;
      this.previousUnitData = undefined;
      this.editUnitIndex = undefined;
    }else {
      this.addUnitActive = false;
    }
  }

  addNewUnit() {
    this.unitList.unshift({
      id: '',
      unitLabel: '',
      description: '',
      isActive: true,
      branch_id: '',
    });
  }

  saveUnit(item) {
    item.branch_id = this.selectedBranch.value;
    this.serv.endpoint = 'account-manager/unit';
    this.serv.post(item).subscribe((response: any) => {
      this.addUnitActive = false;
      this.editUnitIndex = undefined;
      this.previousUnitData = undefined;
      let message = item.unitLabel + ' updated successfully';
      if (item.id === ''){
        this.addNewUnit();
        message = item.unitLabel + ' added successfully';
      }
      item.id = response.id;
      // item.branch = response.branch;

      this.serv.showMessage(message, 'success');
    }, ({error}) => {
      if (error.hasOwnProperty('msg')) {
        this.serv.showMessage(error.msg, 'error');
      }else {
        this.serv.showMessage('Something went wrong. Please contact administator', 'error');
      }
    });
  }

  deleteUnit(index) {

    const item = this.unitList[index];
    const dialogRef = this.dialog.open(ConfirmPopupComponent);
    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        this.serv.endpoint = 'account-manager/unit/' + item.id;
        this.serv.delete().subscribe(response => {
          this.serv.showMessage(item.unitLabel + ' deleted successfully', 'success');
          this.unitList.splice(index, 1);
          if (this.unitList.length <= 1) {
            this.addUnitActive = true;
          }
        }, ({error}) => {
          this.serv.showMessage(error.msg, 'error');
        });
      }
    });
  }

  ngOnDestroy() {
    this.global.unitAdd.next(false);
    if (this.addButtonSubscriber) {
      this.addButtonSubscriber.unsubscribe();
    }
    if (this.selectedCompanySubscriber) {
      this.selectedCompanySubscriber.unsubscribe();
    }
    if (this.selectedBranchSubscriber) {
      this.selectedBranchSubscriber.unsubscribe();
    }
  }

}
