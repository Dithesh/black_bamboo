import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NumericValueType, RxwebValidators } from '@rxweb/reactive-form-validators';
import { BehaviorSubject, merge } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { ConfirmPopupComponent } from 'src/app/shared/components/confirm-popup/confirm-popup.component';
import { DataService } from 'src/app/shared/services/data.service';
import * as math from 'exact-math';


@Injectable()
export class NewTransactionService {
    form: FormGroup;
    accountList;
    filteredAccountList;
    inventoryList;
    editInventoryIndex=0;
    editAccountIndex: number;
    transactionType;
    totalHandler = {
        itemPriceTotal: 0,
        itemQuantityTotal: 0,
        itemGrandTotal: 0,
        taxAndExpenseTotal: 0,
        transactionGrandTotal: 0
    }
    constructor(
        private fb: FormBuilder,
        private _serv: DataService,
        private dialog: MatDialog
    ){
        this.form = this.fb.group({
            id: [''],
            transactionType: ['', [Validators.required, RxwebValidators.oneOf({matchValues:["purchase", "sales","payment","receipt"]})]],
            transactionDate: [new Date()],
            transactionRefNumber: [''],
            accountId: ['', [Validators.required]],
            description: [''],
            grandTotal: [''],
            branch_id: [''],
            company_id: ['', [Validators.required]],
            items: this.fb.array([this.itemForm()]),
            accounts: this.fb.array([])
        })
    }

    resetData() {
        this.resetForm();
        this.getAccountList();
        this.getInventoryList();
    }

    
    // *items handling
    get items() {
        return this.form.get('items') as FormArray;
    }

    itemForm() {
        let form = this.fb.group({
            id: [''],
            item: ['', [Validators.required]],
            itemId: [''],
            quantity: ['', [Validators.required, RxwebValidators.numeric, RxwebValidators.minNumber({value: 1})]],
            amount: ['', [Validators.required, RxwebValidators.numeric, RxwebValidators.numeric, RxwebValidators.minNumber({value: 0})]],
            total: ['', [Validators.required, RxwebValidators.numeric]],
            deletedFlag: [false]
        })
        form.get('item').valueChanges.subscribe(res => {
            if(form.get('item').valid) {
                form.get('amount').setValue(res.pricePerUnit)
            }
        })
        merge(form.get('quantity').valueChanges, form.get('amount').valueChanges).subscribe(response => {
            let quantity = parseFloat(form.get('quantity').value);
            let amount = parseFloat(form.get('amount').value);
            
            if(form.get('quantity').valid && form.get('amount').valid) {
                form.get('total').setValue(math.mul(quantity, amount))
            }else {
                form.get('total').setValue(0)
            }
            this.getOrderTotal();
        })
        return form;
    }

    addAnotherItem() {
        this.validateItemsArray();
        if(this.items.invalid) {
            this._serv.showMessage('Please fill in valid data', 'error');
            return;
        }
        this.items.push(this.itemForm());
        this.editInventoryIndex = this.items.controls.length - 1;
    }

    onEditClick(index) {
        this.validateItemsArray();
        if(this.items.invalid) {
            this._serv.showMessage('Please fill in valid data', 'error');
            return;
        }
        this.editInventoryIndex = index;
    }

    onDeleteItem(index) {
        let dialogRef = this.dialog.open(ConfirmPopupComponent);
        dialogRef.afterClosed().subscribe(data => {
            if(data) {
                let control = this.items.controls[index];
                if(this._serv.notNull(control.get('id').value)) {
                    if(control.invalid) {
                        control.get('item').setValue('1');
                        control.get('amount').setValue(1);
                        control.get('quantity').setValue(1);
                        control.get('total').setValue(1);
                    }
                    control.get('deletedFlag').setValue(true);
                }else {
                    this.items.removeAt(index);
                }
                this.editInventoryIndex=undefined;
                this.getOrderTotal();
            }
        })
    }

    validateItemsArray() {
        this.items.controls.forEach((group:FormGroup) => {
            // control.markAllAsTouched();
            if(!group.get('deletedFlag').value) {
                (<any>Object).values(group.controls).forEach((control: FormControl) => { 
                    control.markAsTouched();
                    control.markAsDirty();
                }) 
            }
        })
    }
    // *items handling

    
    // *accounts transaction handling
    get accounts(){
        return this.form.get('accounts') as FormArray;
    }

    accountForm() {
        let form = this.fb.group({
            id: [''],
            account: ['', [Validators.required]],
            accountId: [''],
            amountProcessType: ['percent', [Validators.required, RxwebValidators.oneOf({matchValues:["percent", "amount"]})]],
            amountValue: ['', [Validators.required, RxwebValidators.numeric({acceptValue:NumericValueType.Both  ,allowDecimal:true })]],
            totalAmount: [''],
            deletedFlag: [false]
        })

        merge(form.get('amountProcessType').valueChanges, form.get('amountValue').valueChanges).subscribe(response => {
            let amount = parseFloat(form.get('amountValue').value);
            
            if(form.get('amountProcessType').valid && form.get('amountValue').valid) {
                if(form.get('amountProcessType').value == 'percent') {
                    // ! Todo take percentage from the items total
                    let amountVal = math.formula(this.totalHandler.itemGrandTotal +'*'+ amount +'/'+ 100); 
                    form.get('totalAmount').setValue(amountVal)
                }else {
                    form.get('totalAmount').setValue(amount)
                }
            }else {
                form.get('totalAmount').setValue(0)
            }
            this.getOrderTotal();
        })
        return form;
    }

    addAnotherAccount() {
        this.validateAccountsArray();
        if(this.accounts.invalid) {
            this._serv.showMessage('Please fill in valid tax or expense data', 'error');
            return;
        }
        this.accounts.push(this.accountForm());
        this.editAccountIndex = this.accounts.controls.length - 1;
    }

    onEditAccountClick(index) {
        this.validateAccountsArray();
        if(this.accounts.invalid) {
            this._serv.showMessage('Please fill in valid data', 'error');
            return;
        }
        this.editAccountIndex = index;
    }

    onDeleteAccount(index) {
        let dialogRef = this.dialog.open(ConfirmPopupComponent);
        dialogRef.afterClosed().subscribe(data => {
            if(data) {
                let control = this.accounts.controls[index];
                if(this._serv.notNull(control.get('id').value)) {
                    if(control.invalid) {
                        control.get('account').setValue('1');
                        control.get('amountValue').setValue(1);
                        control.get('amountProcessType').setValue('percent');
                        control.get('totalAmount').setValue(1);
                        control.get('total').setValue(1);
                    }
                    control.get('deletedFlag').setValue(true);
                }else {
                    this.accounts.removeAt(index);
                }
                this.editAccountIndex=undefined;
                this.getOrderTotal();
            }
        })
    }

    validateAccountsArray() {
        this.accounts.controls.forEach((group:FormGroup) => {
            // control.markAllAsTouched();
            if(!group.get('deletedFlag').value) {
                (<any>Object).values(group.controls).forEach((control: FormControl) => { 
                    control.markAsTouched();
                    control.markAsDirty();
                }) 
            }
        })
    }
    // *accounts transaction handling

    

    getOrderTotal() {
        let itemPriceTotal = 0, itemGrandTotal = 0, itemQuantityTotal = 0, taxAndExpenseTotal=0, transactionGrandTotal=0;
        this.items.value.forEach(elem => {
            if(!elem.deletedFlag) {
                if(!isNaN(parseFloat(elem.amount)) && elem.amount > 0) {
                    itemPriceTotal = math.add(itemPriceTotal, elem.amount);
                }
                if(!isNaN(parseFloat(elem.quantity)) && elem.quantity > 0) {
                    itemQuantityTotal = math.add(itemQuantityTotal, elem.quantity);
                }
                if(!isNaN(parseFloat(elem.total)) && elem.total > 0) {
                    itemGrandTotal = math.add(itemGrandTotal, elem.total);
                }
            }
        })
        this.accounts.value.forEach(elem => {
            if(!elem.deletedFlag) {
                if(!isNaN(parseFloat(elem.totalAmount))) {
                    taxAndExpenseTotal = math.add(taxAndExpenseTotal, elem.totalAmount);
                }
            }
        })
        transactionGrandTotal = itemGrandTotal + taxAndExpenseTotal;
        this.totalHandler = {
            itemPriceTotal: itemPriceTotal,
            itemQuantityTotal: itemQuantityTotal,
            itemGrandTotal: itemGrandTotal,
            taxAndExpenseTotal: taxAndExpenseTotal,
            transactionGrandTotal: transactionGrandTotal
        }
    }

    getAccountList() {
        this._serv.endpoint = "account-manager/ledger?status=true&companyId="+this.form.get('company_id').value;
        this._serv.get().subscribe(response => {
            this.accountList = response as any[];
            this.filteredAccountList = this.accountList;
        })
    }

    getInventoryList() {
        this._serv.endpoint = "account-manager/inventory?status=true&companyId="+this.form.get('company_id').value;
        this._serv.get().subscribe(response => {
            this.inventoryList = response as any[];
        })
    }

    setTransactionType(type) {
        this.transactionType = type;
        this.form.get('transactionType').setValue(this.transactionType);
    }

    resetForm() {
        this.items.controls=[];
        this.items.reset();
        this.accounts.controls=[];
        this.accounts.reset();
        let formValue = this.form.value;
        this.form.reset();
        this.form.patchValue({
            company_id: formValue.company_id,
            branch_id: formValue.branch_id,
            transactionType: this.transactionType,
            transactionDate: new Date()
        })
        this.items.push(this.itemForm());
        // this.accounts.push(this.accountForm());
        this.editInventoryIndex=0;
        this.editAccountIndex=undefined;
    }

    saveFinaldata() {
        this.validateItemsArray();
        this.validateAccountsArray();
        this.form.markAllAsTouched();
        if(this.form.invalid){
            this._serv.showMessage('Please check data before submit. Delete any unwanted empty rows.', 'error');
            return;
        }
        let formData = {...this.form.value};
        console.log(formData);
        
        formData.items.forEach(elem => {
            elem.itemId = elem.item.id;
        })
        formData.accounts.forEach(elem => {
            elem.accountId = elem.account.id;
        })
        this._serv.endpoint="account-manager/transaction";
        this._serv.post(this.form.value).subscribe(response => {

        })
    }
}