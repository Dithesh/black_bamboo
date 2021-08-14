import {Component, OnDestroy, OnInit} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ConfirmPopupComponent } from 'src/app/shared/components/confirm-popup/confirm-popup.component';
import { DataService } from 'src/app/shared/services/data.service';
import { MasterGlobalService } from '../../services/master-global.service';

@Component({
  selector: 'app-ledger-manager',
  templateUrl: './ledger-manager.component.html',
  styleUrls: ['./ledger-manager.component.scss']
})
export class LedgerManagerComponent implements OnInit, OnDestroy {
  accountTypeList = [
    'Purchase Account',
    'Sales Account',
    'Sundry Creditor',
    'Sundry Debitor',
    'Duties and Taxes',
    'Bank Account',
    'Cash Account',
    'Direct Expense',
    'Indirect Expense',
    'Direct Income',
    'Indirect Income'
];
  companyList;
  branchList: any[] = [];
  userData;
  selectedCompany = new FormControl('');
  selectedBranch = new FormControl('');
  addButtonSubscriber;
  ledgerList:any[] = [];
  // branchList:any[] = [];
  addLedgerActive = false;
  editLedgerIndex;
  selectedCompanySubscriber: any;
  selectedBranchSubscriber: any;
  previousLedgerData: any;

  constructor(
    private global: MasterGlobalService,
    private serv: DataService,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {
    this.userData = this.serv.getUserData();
    this.route.parent.data.subscribe(response => {
      this.companyList = response.companyList;
      if (this.companyList.length > 0)
        this.selectedCompany.setValue(this.companyList[0].id);
        this.getAllBranches();
    })
  }

  ngOnInit(): void {
    this.addButtonSubscriber = this.global.ledgerAdd.subscribe(response => {
      if(response) {
        this.addAnotherLedger();
      }
    })
    this.selectedCompanySubscriber = this.selectedCompany.valueChanges.subscribe(response => {
      this.selectedBranch.setValue('', {emitEvent: false});
      this.branchList = [];
      this.getAllBranches();
    });
    this.selectedBranchSubscriber = this.selectedBranch.valueChanges.subscribe(response => {
      this.getAllLedgers();
    });

  }

  getAllLedgers() {
    this.ledgerList = [];
    this.addLedgerActive = false;
    this.serv.endpoint = 'account-manager/ledger?branch_id=' + this.selectedBranch.value;
    this.serv.get().subscribe((response: any[]) => {
      if(Array.isArray(response)) {
        this.ledgerList = response;
        if (this.ledgerList.length === 0) {
          this.addLedgerActive = true;
        }
        this.addNewLedger();
      }else {
        if (this.ledgerList.length === 0) {
          this.addLedgerActive = true;
        }
        this.addNewLedger();
      }
    });
  }

  getAllBranches() {
    this.serv.endpoint = 'order-manager/branch?status=active&companyId=' + this.selectedCompany.value;
    this.serv.get().subscribe((response: any[]) => {
      this.branchList = response;
    });
  }

  addAnotherLedger() {
    if (!this.addLedgerActive && !this.editLedgerIndex) {
      this.addLedgerActive = true;
    }
  }

  onLedgerEdit(index) {
    this.addLedgerActive = false;
    this.editLedgerIndex = index;
    this.previousLedgerData = {...this.ledgerList[index]};
  }

  onCancelEdit() {
    if(this.serv.notNull(this.editLedgerIndex)) {
      this.ledgerList[this.editLedgerIndex] = this.previousLedgerData;
      this.previousLedgerData = undefined;
      this.editLedgerIndex = undefined;
    }else {
      this.addLedgerActive = false;
    }
  }

  addNewLedger() {
    this.ledgerList.unshift({
      id: '',
      ledgerName: '',
      accountType: '',
      description: '',
      isActive: true,
      // branchId: '',
      branch_id: ''
    })
  }

  saveLedger(item) {
    item.branch_id = this.selectedBranch.value;
    this.serv.endpoint = 'account-manager/ledger';
    this.serv.post(item).subscribe((response: any) => {
      this.addLedgerActive = false;
      this.editLedgerIndex = undefined;
      this.previousLedgerData = undefined;
      let message = item.ledgerName + ' updated successfully';
      if(item.id === ''){
        this.addNewLedger();
        message = item.ledgerName + ' added successfully';
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
    })
  }

  deleteLedger(index) {

    const item = this.ledgerList[index];
    const dialogRef = this.dialog.open(ConfirmPopupComponent);
    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        this.serv.endpoint = 'account-manager/ledger/' + item.id;
        this.serv.delete().subscribe(response => {
          this.serv.showMessage(item.ledgerName + ' deleted successfully', 'success');
          this.ledgerList.splice(index, 1);
          if(this.ledgerList.length <= 1) {
            this.addLedgerActive = true;
          }
        }, ({error}) => {
          this.serv.showMessage(error['msg'], 'error');
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
