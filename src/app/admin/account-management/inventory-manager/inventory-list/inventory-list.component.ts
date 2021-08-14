import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MasterGlobalService} from '../../services/master-global.service';
import {DataService} from '../../../../shared/services/data.service';
import {ActivatedRoute} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmPopupComponent} from '../../../../shared/components/confirm-popup/confirm-popup.component';

@Component({
  selector: 'app-inventory-list',
  templateUrl: './inventory-list.component.html',
  styleUrls: ['./inventory-list.component.scss']
})
export class InventoryListComponent implements OnInit, OnDestroy {
  companyList;
  branchList: any[] = [];
  userData;
  selectedCompany = new FormControl('');
  selectedBranch = new FormControl('');
  addButtonSubscriber;
  inventoryList: any[] = [];
  // branchList:any[] = [];
  addInventoryActive = false;
  editInventoryIndex;
  selectedCompanySubscriber: any;
  selectedBranchSubscriber: any;
  previousInventoryData: any;

  constructor(
    private global: MasterGlobalService,
    private serv: DataService,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {
    this.userData = this.serv.getUserData();
    if (this.userData.roles === 'Super Admin' || this.userData.roles === 'Company Admin' ) {
      this.route.parent.data.subscribe(response => {
        this.companyList = response.companyList;
        if (this.companyList.length > 0) {
          this.selectedCompany.setValue(this.companyList[0].id);
          this.getAllBranches();
        }
      });
    } else {
      this.getAllInventorys();
    }
  }

  ngOnInit(): void {

    this.selectedCompanySubscriber = this.selectedCompany.valueChanges.subscribe(response => {
      this.selectedBranch.setValue('', {emitEvent: false});
      this.branchList = [];
      this.getAllBranches();
    });
    this.selectedBranchSubscriber = this.selectedBranch.valueChanges.subscribe(response => {
      this.getAllInventorys();
    });

  }

  getAllBranches() {
    this.serv.endpoint = 'order-manager/branch?status=active&companyId=' + this.selectedCompany.value;
    this.serv.get().subscribe((response: any[]) => {
      this.branchList = response;
    });
  }

  getAllInventorys() {
    this.inventoryList = [];
    this.addInventoryActive = false;
    this.serv.endpoint = 'account-manager/inventory?branch_id=' + this.selectedBranch.value;
    this.serv.get().subscribe((response: any[]) => {
      this.inventoryList = response;
      // this.addNewInventory();
    });
  }


  deleteInventory(index) {

    const item = this.inventoryList[index];
    const dialogRef = this.dialog.open(ConfirmPopupComponent);
    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        this.serv.endpoint = 'account-manager/inventory/' + item.id;
        this.serv.delete().subscribe(response => {
          this.serv.showMessage(item.inventoryName + ' deleted successfully', 'success');
          this.inventoryList.splice(index, 1);
          if (this.inventoryList.length <= 1) {
            this.addInventoryActive = true;
          }
        }, ({error}) => {
          this.serv.showMessage(error.msg, 'error');
        });
      }
    });
  }

  ngOnDestroy() {
    if (this.selectedCompanySubscriber) {
      this.selectedCompanySubscriber.unsubscribe();
    }
    if (this.selectedBranchSubscriber) {
      this.selectedBranchSubscriber.unsubscribe();
    }
  }

}
