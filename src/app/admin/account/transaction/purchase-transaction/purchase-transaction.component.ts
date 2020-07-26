import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormGroupDirective } from '@angular/forms';
import { DataService } from 'src/app/shared/services/data.service';
import { Observable, of, merge } from 'rxjs';
import {map, startWith, debounceTime} from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { ConfirmPopupComponent } from 'src/app/shared/components/confirm-popup/confirm-popup.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-purchase-transaction',
  templateUrl: './purchase-transaction.component.html',
  styleUrls: ['./purchase-transaction.component.scss']
})
export class PurchaseTransactionComponent implements OnInit {
  form: FormGroup;
  accountList: any[]=[];
  filteredFromAccountList: Observable<any[]>;
  filteredParticularsAccountList: Observable<any[]>;
  filteredInventoryList: Observable<any[]>;
  totalInventoryAmount=0;

  fromAccountTypes = [
      'Purchase Account',
      'Sales Account',
      'Sundry Creditor',
      'Sundry Debitor',
      'Bank Account',
      'Cash Account'
  ];
  particularAccountTypes = [
      'Duties and Taxes',
      // 'Direct Income',
      // 'Indirect Income'
  ];
  fromAccountList: any[] = [];
  particularAccountList: any[] = [];
  inventoryList: any[] = [];

  constructor(
    private fb: FormBuilder,
    public _serv: DataService,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) { 
    this.form = this.fb.group({
      id: [''],
      transactionDate: [''],
      transactionRefNumber: [''],
      accountId: [''],
      accountName: ['', [Validators.required, this._serv.autoCompleteMatch]],
      transactionType: [''],
      accountCurrentBalance: [''],
      comment: [''],
      grandTotal: [''],
      items: this.fb.array([this.addNewItem()]),
      accounts: this.fb.array([this.addNewAccount()])
    })

    this.route.data.subscribe((response:any) => {
      this.getInventoryItems(response.items)
      this.getAccounts(response.accounts);
    })
  }

  ngOnInit(): void {
    // this.items.valueChanges.subscribe(response => {
    //   this.checkForNewItemAdding();
    // })
  }

  get items() {
    return this.form.get('items') as FormArray;
  }

  addNewItem(required=false) {
    let requiredValidator = [];
    if(required) {
      requiredValidator.push(Validators.required)
    }
    let form =  this.fb.group({
      id: [''],
      itemId: [''],
      itemName: ['', [...requiredValidator, this._serv.autoCompleteMatch]],
      unit: [''],
      quantity: ['', [
        ...requiredValidator,
        Validators.min(1),
        Validators.max(1000)]],
      amount: ['', [
        ...requiredValidator,
        Validators.min(1)
      ]],
      total: [''],
      deletedFlag: [false]
    })

    form.get('itemName').valueChanges.pipe(
      debounceTime(300)
    ).subscribe(value => {
      if(value instanceof Object) {
        form.get('amount').setValue(value.pricePerUnit)
        form.get('unit').setValue(value.unit.unitLabel)
        form.get('itemId').setValue(value.id)
        this.checkForNewItemAdding();
      }
    })
    merge(
      form.get('quantity').valueChanges,
      form.get('amount').valueChanges
    ).pipe(
      debounceTime(300)
    ).subscribe((value) => {
      if(this._serv.notNull(form.get('quantity').value) && this._serv.notNull(form.get('amount').value)) {
        form.get('total').setValue(parseFloat(form.get('quantity').value) * parseFloat(form.get('amount').value));
        this.updateInventoryTotal();
      }
      this.checkForNewItemAdding();
    })
    
    this.filteredInventoryList = form.get('itemName').valueChanges.pipe(
      startWith(''),
      map(value => this.filterInventoryLists(value))
    )
    return form;
  }

  updateInventoryTotal() {
    this.totalInventoryAmount=0;
    this.items.controls.forEach(elem => {
      if(elem.valid && !elem.get('deletedFlag').value && elem.get('itemName').value instanceof Object && parseFloat(elem.get('total').value) > 0) {
        this.totalInventoryAmount+=parseFloat(elem.get('total').value);
      }
    })
    this.calculateTotalAmount();
  }

  filterInventoryLists(value) {
    if(!value)return this.inventoryList;
    if(value instanceof Object)return this.inventoryList;
    return this.inventoryList.filter(x => x.itemName.toLowerCase().includes(value.toLowerCase()))
  }

  getInventoryItems(list) {
    this.inventoryList = list;
    this.filteredInventoryList = of(this.inventoryList);
  }

  checkForNewItemAdding() {
    let invalid=false;
    this.items.controls.forEach((elem, index) => {
      if(!elem.get('deletedFlag').value) {
        if(index != this.items.controls.length -1) {
          elem.markAllAsTouched();
          elem.markAsDirty();
          if(elem.invalid)invalid=true;
        }else if(!invalid) {
          
          let lastValue = elem.value;
          if(this._serv.notNull(lastValue.itemName) && this._serv.notNull(lastValue.quantity) && this._serv.notNull(lastValue.amount) && elem.valid) {
            elem.get('itemName').setValidators([Validators.required, this._serv.autoCompleteMatch]);
            elem.get('quantity').setValidators([Validators.required, Validators.min(1), Validators.max(1000)]);
            elem.get('amount').setValidators([Validators.required, Validators.min(1)]);
          }else {
            invalid = true;
          }
        }
      }

    })
    if(!invalid) {
      this.items.push(this.addNewItem());
    }
  }

  itemNameDisplay(item: any): string {
    return item && item.itemName ? item.itemName : '';
  }

  deleteInventoryItem(i) {
    if(this.items.controls[i].get('id').value != ""){
      let id = this.items.get('id').value;
      this.items.controls[i].reset();
      this.items[i].get('id').setValue(id);
      this.items.get('deletedFlag').setValue(true);
    }else {
      this.items.removeAt(i);
    }
    this.updateInventoryTotal();
  }

  get accounts() {
    return this.form.get('accounts') as FormArray;
  }

  addNewAccount(required=false) {
    let requiredValidator = [];
    if(required) {
      requiredValidator.push(Validators.required)
    }
    let form =  this.fb.group({
      id: [''],
      accountId: [''],
      accountName: ['', [...requiredValidator, this._serv.autoCompleteMatch]],
      percentage: ['', [
        Validators.min(1),
        Validators.max(100)]],
      amount: ['', [
        ...requiredValidator,
        Validators.min(1)
      ]],
      currentBalance: [''],
      deletedFlag: [false]
    })
    form.get('percentage').disable();
    // form.get('amount').disable();

    form.get('accountName').valueChanges.pipe(
      debounceTime(300)
    ).subscribe(value => {
      if(value instanceof Object) {
        form.get('accountId').setValue(value.id)
        
        if(value.taxPercentage > 0) {
          form.get('percentage').enable();
          form.get('percentage').setValue(value.taxPercentage);
        }else {
          form.get('percentage').disable();
          this.checkForNewAccountAdding();
        }
      }
    });
    
    merge(
      form.get('percentage').valueChanges
    ).pipe(
      debounceTime(200)
    ).subscribe((value) => {
      this.caclulatePercentageAmount(form);
      this.checkForNewAccountAdding();
    });
    
    this.filteredParticularsAccountList = form.get('accountName').valueChanges.pipe(
      startWith(''),
      map(value => this.filterParticularAccountLists(value))
    )
    merge(
      form.get('amount').valueChanges
    ).pipe(
      debounceTime(300)
    ).subscribe((value) => {
      this.checkForNewAccountAdding();
      this.calculateTotalAmount();
    });
    
    this.filteredParticularsAccountList = form.get('accountName').valueChanges.pipe(
      startWith(''),
      map(value => this.filterParticularAccountLists(value))
    )
    return form;
  }

  caclulatePercentageAmount(form) {
    let percentage = form.get('percentage').value;
    if(parseFloat(percentage) > 0) {
      form.get('amount').setValue((parseFloat(percentage) * this.totalInventoryAmount)/100, {emitEvent: false});
      this.calculateTotalAmount();
    }
  }

  filterParticularAccountLists(value) {
    if(!value)return this.particularAccountList;
    if(value instanceof Object)return this.particularAccountList;
    return this.particularAccountList.filter(x => x.accountName.toLowerCase().includes(value.toLowerCase()))
  }

  checkForNewAccountAdding() {
    let invalid=false;
    this.accounts.controls.forEach((elem, index) => {
      if(!elem.get('deletedFlag').value) {
        if(index != this.items.controls.length -1) {
          elem.markAllAsTouched();
          elem.markAsDirty();
          if(elem.invalid)invalid=true;
        }else if(!invalid) {
          
          let lastValue = elem.value;
          if(this._serv.notNull(lastValue.accountName) && this._serv.notNull(lastValue.amount) && elem.valid) {
            elem.get('accountName').setValidators([Validators.required, this._serv.autoCompleteMatch]);
            elem.get('amount').setValidators([Validators.required, Validators.min(1)]);
          }else {
            invalid = true;
          }
        }
      }

    })
    if(!invalid) {
      this.accounts.push(this.addNewAccount());
    }
  }

  deleteAccount(i) {
    if(this.accounts.controls[i].get('id').value != ""){
      let id = this.accounts.get('id').value;
      this.accounts.controls[i].reset();
      this.accounts[i].get('id').setValue(id);
      this.accounts.get('deletedFlag').setValue(true);
    }else {
      this.accounts.removeAt(i);
    }
  }

  calculateTotalAmount() {
    let taxAmount = 0;
    this.accounts.controls.forEach(control => {
      if(control.valid && control.get('amount').value > 0 && this._serv.notNull(control.get('accountName').value)) {
        taxAmount+=parseFloat(control.get('amount').value);
      }
    })
    this.form.get('grandTotal').setValue(this.totalInventoryAmount + taxAmount);
  }
  
  accountNameDisplay(account: any): string {
    return account && account.ledgerName ? account.ledgerName : '';
  }

  getAccounts(list) {
    this.accountList = list;
    this.fromAccountList = this.accountList.filter(x => this.fromAccountTypes.indexOf(x.accountType) >= 0);
    this.particularAccountList = this.accountList.filter(x => this.particularAccountTypes.indexOf(x.accountType) >= 0);

    this.filteredFromAccountList = this.form.get('accountName').valueChanges.pipe(
      startWith(''),
      map(value => this.filterFromAccountists(value))
    )
  }

  filterFromAccountists(value) {    
    if(!value)return this.fromAccountList;
    if(value instanceof Object)return this.fromAccountList;
    return this.fromAccountList.filter(x => x.ledgerName.toLowerCase().includes(value.toLowerCase()))
  }

  savePurchaseData(event, formDirective: FormGroupDirective) {
    event.preventDefault();
    this.form.markAllAsTouched();
    if(this.form.invalid)return;

    let items = [];
    this.items.controls.forEach(elem => {
      let lastValue = elem.value;
        if(this._serv.notNull(lastValue.itemName) && this._serv.notNull(lastValue.quantity) && this._serv.notNull(lastValue.amount) && elem.valid) {
          items.push(lastValue)
        }
    })

    let accounts = [];
    this.accounts.controls.forEach(elem => {
      let lastValue = elem.value;
      if(this._serv.notNull(lastValue.accountName) && this._serv.notNull(lastValue.amount) && elem.valid) {
        accounts.push(lastValue);
      }
    })

    if(items.length <= 0) {
      this._serv.showMessage("Please select items", 'error');
      return;
    }

    let formValue = {...this.form.value};
    formValue.accountId = formValue.accountName.id;
    formValue.items = items;
    formValue.accounts = accounts;

    
    let dialogRef = this.dialog.open(ConfirmPopupComponent, {
      data: {
        message: "Are you sure want to save?"
      }
    });
    dialogRef.afterClosed().subscribe(data => {
      if(data) {
        this._serv.endpoint = 'account-manager/purchase';
        this._serv.post(formValue).subscribe(response => {
          this._serv.showMessage("Saved successfully", 'success');
          this.resetForm(formDirective);
        })

      }
    });
  }


  resetForm(formDirective) {
    this.form.updateValueAndValidity();
    this.items.controls = [];
    this.items.reset();
    this.items.push(this.addNewItem());
    this.accounts.controls = [];
    this.accounts.reset();
    this.accounts.push(this.addNewAccount());
    formDirective.resetForm();
    this.form.reset();
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }
}
