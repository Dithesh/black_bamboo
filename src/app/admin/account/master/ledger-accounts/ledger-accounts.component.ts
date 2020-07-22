import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { DataService } from 'src/app/shared/services/data.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmPopupComponent } from 'src/app/shared/components/confirm-popup/confirm-popup.component';

@Component({
  selector: 'app-ledger-accounts',
  templateUrl: './ledger-accounts.component.html',
  styleUrls: ['./ledger-accounts.component.scss']
})
export class LedgerAccountsComponent implements OnInit {
  form: FormGroup;
  editIndex: any;
  ledgerAccountTypes = [
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
  constructor(
    private fb: FormBuilder,
    private _serv: DataService,
    private dialog: MatDialog
  ) { 
    this.form = this.fb.group({
      ledgers: this.fb.array([]),
      newLedgers: this.fb.array([]),
    })
  }

  ngOnInit(): void {
    this.getAllLedgerAccounts();
  }

  get ledgers() {
    return this.form.get('ledgers') as FormArray;
  }

  get newLedgers() {
    return this.form.get('newLedgers') as FormArray;
  }

  getAllLedgerAccounts() {
    this.ledgers.controls = [];
    this.ledgers.reset();
    this._serv.endpoint = "account-manager/ledger";
    this._serv.get().subscribe((response: any[]) => {
      response.forEach(elem => {
        let form = this.newLedger();
        form.patchValue(elem);
        this.ledgers.push(form)
      })
      if(response.length == 0){
        this.newLedgers.push(this.newLedger());
      }
    })
  }

  addNewLedger() {
    this.newLedgers.push(this.newLedger());
  }

  removeNewLedger(index) {
    this.newLedgers.removeAt(index);
  }

  newLedger() {
    return this.fb.group({
      id: [''],
      ledgerName: ['', [Validators.required]],
      accountType: ['', [Validators.required]],
      description: [''],
      taxPercentage: ['0'],
      openingBalance: ['0'],
      isActive: [true],
    });
  }

  saveLedger(ledgerForm: FormGroup, index=null) {
    ledgerForm.markAllAsTouched();
    if(ledgerForm.invalid)return;
    let data = {...ledgerForm.value};

    
    let api=null;
    this._serv.endpoint="account-manager/ledger";
    if(data.id == "") {
      api = this._serv.post(data);
    }else {
      this._serv.endpoint+="/"+data.id;
      api = this._serv.put(data);
    }
    api.subscribe(response => {
      if(data.id == "" && index != null) {
        this.newLedgers.removeAt(index);
        this.getAllLedgerAccounts();
      }else {
        this.editIndex=undefined;
      }
    })
  }

  onEditClick(index) {
    this.editIndex= index;
  }

  deleteLedger(index) {
    let item = this.ledgers.controls[index].value;
    let dialogRef = this.dialog.open(ConfirmPopupComponent);
    dialogRef.afterClosed().subscribe(data => {
      if(data) {
        this._serv.endpoint = "account-manager/ledger/"+item.id;
        this._serv.delete().subscribe(response => {
          this._serv.showMessage("Ledger deleted successfully", 'success');
          this.ledgers.removeAt(index);
        }, ({error}) => {
          this._serv.showMessage(error['msg'], 'error');
        })
      }
    })
  }

}
