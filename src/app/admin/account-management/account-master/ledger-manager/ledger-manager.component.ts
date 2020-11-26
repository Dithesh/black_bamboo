import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ConfirmPopupComponent } from 'src/app/shared/components/confirm-popup/confirm-popup.component';
import { DataService } from 'src/app/shared/services/data.service';
import { MasterGlobalService } from '../services/master-global.service';

@Component({
  selector: 'app-ledger-manager',
  templateUrl: './ledger-manager.component.html',
  styleUrls: ['./ledger-manager.component.scss']
})
export class LedgerManagerComponent implements OnInit {
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
  selectedCompany = new FormControl('');
  addButtonSubscriber;
  ledgerList:any[] = [];
  // branchList:any[] = [];
  addLedgerActive = false;
  editLedgerIndex;
  selectedCompanySubscriber: any;
  previousLedgerData: any;

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
    this.addButtonSubscriber = this._global.ledgerAdd.subscribe(response => {
      if(response) {
        this.addAnotherLedger();
      }
    })
    this.selectedCompanySubscriber = this.selectedCompany.valueChanges.subscribe(response => {
      this.getAllLedgers();
    })
    this.getAllLedgers();

  }

  getAllLedgers() {
    this.ledgerList=[];
    this.addLedgerActive=false;
    this._serv.endpoint = "account-manager/ledger?companyId="+this.selectedCompany.value;
    this._serv.get().subscribe((response:any[]) => {
      this.ledgerList = response;
      if(this.ledgerList.length == 0) {
        this.addLedgerActive=true;
      }      
      this.addNewLedger();
    })
  }

  addAnotherLedger() {
    if(!this.addLedgerActive && !this.editLedgerIndex) {
      this.addLedgerActive=true;
    }
  }

  onLedgerEdit(index) {
    this.addLedgerActive=false;
    this.editLedgerIndex = index;
    this.previousLedgerData = {...this.ledgerList[index]};
  }

  onCancelEdit() {
    if(this._serv.notNull(this.editLedgerIndex)) {
      this.ledgerList[this.editLedgerIndex] = this.previousLedgerData;
      this.previousLedgerData=undefined;
      this.editLedgerIndex = undefined;
    }else {
      this.addLedgerActive=false;
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
      company_id: ''
    })
  }

  saveLedger(item) {
    item.company_id = this.selectedCompany.value;
    this._serv.endpoint="account-manager/ledger";
    this._serv.post(item).subscribe((response:any) => {
      this.addLedgerActive=false;
      this.editLedgerIndex=undefined;
      this.previousLedgerData=undefined;
      let message = item.ledgerName + ' updated successfully';
      if(item.id == ""){
        this.addNewLedger();
        message = item.ledgerName + ' added successfully';
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

  deleteLedger(index) {

    let item = this.ledgerList[index];
    let dialogRef = this.dialog.open(ConfirmPopupComponent);
    dialogRef.afterClosed().subscribe(data => {
      if(data) {
        this._serv.endpoint = "account-manager/ledger/"+item.id;
        this._serv.delete().subscribe(response => {
          this._serv.showMessage(item.ledgerName + " deleted successfully", 'success');
          this.ledgerList.splice(index, 1);
          if(this.ledgerList.length <= 1) {
            this.addLedgerActive=true;
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
