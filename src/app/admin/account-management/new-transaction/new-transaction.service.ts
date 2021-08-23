import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NumericValueType, RxwebValidators } from '@rxweb/reactive-form-validators';
import { BehaviorSubject, merge } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { ConfirmPopupComponent } from 'src/app/shared/components/confirm-popup/confirm-popup.component';
import { DataService } from 'src/app/shared/services/data.service';
import * as math from 'exact-math';
import { Router } from '@angular/router';
import * as moment from 'moment';


@Injectable()
export class NewTransactionService {
    form: FormGroup;
    accountList;
    filteredAccountList;
    filteredExpenseAccountList;
    branchList;
    filteredBranchList;
    inventoryList;
    editInventoryIndex: number;
    editAccountIndex: number;
    transactionType;
    totalHandler = {
        itemPriceTotal: 0,
        itemQuantityTotal: 0,
        itemGrandTotal: 0,
        taxAndExpenseTotal: 0,
        transactionGrandTotal: 0
    };
    topAccountExclude = [];
    taxAndExpenseExclude = [];
    transactionId;
    transactionData;
    processingAction = false;
    userData: any;
    constructor(
        private fb: FormBuilder,
        private serv: DataService,
        private dialog: MatDialog,
        private router: Router
    ){
        this.form = this.fb.group({
            id: [''],
            transactionType: ['', [Validators.required, RxwebValidators.oneOf({matchValues: ['purchase', 'sales', 'payment', 'receipt']})]],
            transactionDate: [new Date()],
            transactionRefNumber: [''],
            accountId: ['', [Validators.required]],
            description: [''],
            grandTotal: [''],
            branch_id: [''],
            company_id: [''],
            items: this.fb.array([]),
            accounts: this.fb.array([])
        });
    }

    resetData(id= null) {
        this.transactionId = id;
        // this.getAccountList();
        // this.getInventoryList();
        this.userData = this.serv.getUserData();

        if (this.userData.roles === 'Super Admin') {
          // this.getAllCompanies();
        } else if (this.userData.roles === 'Company Admin') {
          this.form.patchValue({
            company_id: this.userData.company_id
          }, {emitEvent: false});
          this.getBranchList();
        }else {
          this.form.patchValue({
              company_id: this.userData.company_id,
              branch_id: this.userData.branch_id
          }, {emitEvent: false});
        }
        if (this.serv.notNull(this.form.get('branch_id').value)) {
          this.getAccountList();
          this.getInventoryList();
        }
        this.totalHandler = {
            itemPriceTotal: 0,
            itemQuantityTotal: 0,
            itemGrandTotal: 0,
            taxAndExpenseTotal: 0,
            transactionGrandTotal: 0
        };
        if (this.serv.notNull(this.transactionId)) {
            this.serv.endpoint = 'account-manager/transaction/' + this.transactionId;
            this.serv.get().subscribe((response: any) => {
                this.transactionData = response;
                this.form.patchValue({...this.transactionData, transactionType: this.transactionData.transactionType.toLowerCase()});
                this.items.controls = [];
                this.items.reset();
                this.transactionData.items.forEach(elem => {

                    const form = this.itemForm();
                    form.patchValue(elem);
                    this.items.push(form);
                });
                this.itemMapping();

                this.accounts.controls = [];
                this.accounts.reset();
                this.transactionData.accounts.forEach(elem => {
                    const form = this.accountForm();
                    form.patchValue(elem);
                    this.accounts.push(form);
                });
                this.accountMapping();
                this.getOrderTotal();
            });
        }else {
            this.resetForm();
        }
    }


    // *items handling
    get items() {
        return this.form.get('items') as FormArray;
    }

    itemForm() {
        const form = this.fb.group({
            id: [''],
            item: ['', [Validators.required]],
            itemId: [''],
            quantity: ['', [Validators.required, RxwebValidators.numeric, RxwebValidators.minNumber({value: 1})]],
            amount: ['', [Validators.required, RxwebValidators.numeric, RxwebValidators.numeric, RxwebValidators.minNumber({value: 0})]],
            total: ['', [Validators.required, RxwebValidators.numeric]],
            deletedFlag: [false]
        });
        form.get('item').valueChanges.subscribe(res => {
            if (form.get('item').valid) {
                form.get('amount').setValue(res.pricePerUnit);
            }
        });
        merge(form.get('quantity').valueChanges, form.get('amount').valueChanges).subscribe(response => {
            const quantity = parseFloat(form.get('quantity').value);
            const amount = parseFloat(form.get('amount').value);

            if (form.get('quantity').valid && form.get('amount').valid) {
                form.get('total').setValue(math.mul(quantity, amount), {emitEvent: false});
            }else {
                form.get('total').setValue(0, {emitEvent: false});
            }
            this.getOrderTotal();
            this.accounts.controls.forEach(control => {
                this.handleAccountCalculation(control);
            });
            if (this.accounts.controls.length > 0) {
                this.getOrderTotal();
            }
        });
        return form;
    }

    addAnotherItem() {
        this.validateItemsArray();
        if (this.items.invalid) {
            this.serv.showMessage('Please fill in valid data', 'error');
            return;
        }
        this.items.push(this.itemForm());
        this.editInventoryIndex = this.items.controls.length - 1;
    }

    onEditClick(index) {
        this.validateItemsArray();
        if (this.items.invalid) {
            this.serv.showMessage('Please fill in valid data', 'error');
            return;
        }
        this.editInventoryIndex = index;
    }

    onDeleteItem(index) {
        const dialogRef = this.dialog.open(ConfirmPopupComponent);
        dialogRef.afterClosed().subscribe(data => {
            if (data) {
                const control = this.items.controls[index];
                if (this.serv.notNull(control.get('id').value)) {
                    if (control.invalid) {
                        control.get('item').setValue('1', {emitEvent: false});
                        control.get('amount').setValue(1, {emitEvent: false});
                        control.get('quantity').setValue(1, {emitEvent: false});
                        control.get('total').setValue(1, {emitEvent: false});
                    }
                    control.get('deletedFlag').setValue(true, {emitEvent: false});
                }else {
                    this.items.removeAt(index);
                }
                this.editInventoryIndex = undefined;
                this.getOrderTotal();
            }
        });
    }

    validateItemsArray() {
        this.items.controls.forEach((group: FormGroup) => {
            // control.markAllAsTouched();
            if (!group.get('deletedFlag').value) {
                (Object as any).values(group.controls).forEach((control: FormControl) => {
                    control.markAsTouched();
                    control.markAsDirty();
                });
            }
        });
    }
    // *items handling


    // *accounts transaction handling
    get accounts(){
        return this.form.get('accounts') as FormArray;
    }

    accountForm() {
        const form = this.fb.group({
            id: [''],
            account: ['', [Validators.required]],
            accountId: [''],
            amountProcessType: ['percent', [Validators.required, RxwebValidators.oneOf({matchValues: ['percent', 'amount']})]],
            amountValue: ['', [Validators.required, RxwebValidators.numeric({acceptValue: NumericValueType.Both  , allowDecimal: true })]],
            totalAmount: [''],
            deletedFlag: [false]
        });

        merge(form.get('amountProcessType').valueChanges, form.get('amountValue').valueChanges).subscribe(response => {
            this.handleAccountCalculation(form);
            this.getOrderTotal();
        });
        return form;
    }

    handleAccountCalculation(form) {
        const amount = parseFloat(form.get('amountValue').value);

        if (form.get('amountProcessType').valid && form.get('amountValue').valid) {
            if (form.get('amountProcessType').value == 'percent') {
                // ! Todo take percentage from the items total
                const amountVal = math.formula(this.totalHandler.itemGrandTotal + '*' + amount + '/' + 100);
                form.get('totalAmount').setValue(amountVal, {emitEvent: false});
            }else {
                form.get('totalAmount').setValue(amount, {emitEvent: false});
            }
        }else {
            form.get('totalAmount').setValue(0, {emitEvent: false});
        }
    }

    addAnotherAccount() {
        this.validateAccountsArray();
        if (this.accounts.invalid) {
            this.serv.showMessage('Please fill in valid tax or expense data', 'error');
            return;
        }
        const form = this.accountForm();
        if (this.transactionType === 'payment' || this.transactionType === 'receipt') {
          form.get('amountProcessType').setValue('amount');
        }
        this.accounts.push(form);
        this.editAccountIndex = this.accounts.controls.length - 1;
    }

    onEditAccountClick(index) {
        this.validateAccountsArray();
        if (this.accounts.invalid) {
            this.serv.showMessage('Please fill in valid data', 'error');
            return;
        }
        this.editAccountIndex = index;
    }

    onDeleteAccount(index) {
        const dialogRef = this.dialog.open(ConfirmPopupComponent);
        dialogRef.afterClosed().subscribe(data => {
            if (data) {
                const control = this.accounts.controls[index];
                if (this.serv.notNull(control.get('id').value)) {
                    if (control.invalid) {
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
                this.editAccountIndex = undefined;
                this.getOrderTotal();
            }
        });
    }

    validateAccountsArray() {
        this.accounts.controls.forEach((group: FormGroup) => {
            // control.markAllAsTouched();
            if (!group.get('deletedFlag').value) {
                (Object as any).values(group.controls).forEach((control: FormControl) => {
                    control.markAsTouched();
                    control.markAsDirty();
                });
            }
        });
    }
    // *accounts transaction handling



    getOrderTotal() {
        let itemPriceTotal = 0;
        let itemGrandTotal = 0;
        let itemQuantityTotal = 0;
        let taxAndExpenseTotal = 0;
        let transactionGrandTotal = 0;
        this.items.value.forEach(elem => {
            if (!elem.deletedFlag) {
                if (!isNaN(parseFloat(elem.amount)) && elem.amount > 0) {
                    itemPriceTotal = math.add(itemPriceTotal, elem.amount);
                }
                if (!isNaN(parseFloat(elem.quantity)) && elem.quantity > 0) {
                    itemQuantityTotal = math.add(itemQuantityTotal, elem.quantity);
                }
                if (!isNaN(parseFloat(elem.total)) && elem.total > 0) {
                    itemGrandTotal = math.add(itemGrandTotal, elem.total);
                }
            }
        });
        this.accounts.value.forEach(elem => {
            if (!elem.deletedFlag) {
                if (!isNaN(parseFloat(elem.totalAmount))) {
                    taxAndExpenseTotal = math.add(taxAndExpenseTotal, elem.totalAmount);
                }
            }
        });
        transactionGrandTotal = itemGrandTotal + taxAndExpenseTotal;
        this.totalHandler = {
            itemPriceTotal,
            itemQuantityTotal,
            itemGrandTotal,
            taxAndExpenseTotal,
            transactionGrandTotal
        };
    }

    getAccountList() {
        this.serv.endpoint = 'account-manager/ledger';
        this.serv.getByParam({
          status: true,
          branch_id: this.form.get('branch_id').value,
        }).subscribe(response => {
            this.accountList = response as any[];
            this.filteredAccountList = this.accountList;
            this.filteredExpenseAccountList = this.accountList;
            this.accountMapping();
        });
    }

    getInventoryList() {
        this.serv.endpoint = 'account-manager/inventory?status=true&branch_id=' + this.form.get('branch_id').value;
        this.serv.get().subscribe(response => {
            this.inventoryList = response as any[];
            this.itemMapping();

        });
    }

    itemMapping() {
        if (this.transactionId) {
            this.items.controls.forEach(control => {
                this.inventoryList.forEach(elem => {
                    if (control.get('item').value.id === elem.id) {
                        control.get('item').setValue(elem);
                    }
                });
            });
        }
    }

    accountMapping() {
        if (this.transactionId) {
            this.accounts.controls.forEach(control => {
                this.accountList.forEach(elem => {
                    if (control.get('account').value.id === elem.id) {
                        control.get('account').setValue(elem);
                    }
                });
            });
        }
    }

    setTransactionType(type) {
        this.transactionType = type;
        this.form.get('transactionType').setValue(this.transactionType);
        this.topAccountExclude = [
            'Duties and Taxes',
            'Expenses',
            'Incomes'
        ];
        if (this.transactionType === 'purchase' || this.transactionType === 'sales') {
            this.taxAndExpenseExclude = [
                'Purchase Account',
                'Sales Account',
                'Others Account',
                'Bank Account',
                'Cash Account'
            ];
        }else {
            this.taxAndExpenseExclude = [];
        }
    }

    resetForm() {
        this.items.controls = [];
        this.items.reset();
        this.accounts.controls = [];
        this.accounts.reset();
        const formValue = {...this.form.value};
        this.form.reset();
        this.form.patchValue({
            company_id: formValue.company_id,
            branch_id: formValue.branch_id,
            transactionType: this.transactionType,
            transactionDate: new Date()
        }, {emitEvent: false});
        // this.items.push(this.itemForm());
        // this.accounts.push(this.accountForm());
        this.editInventoryIndex = undefined;
        this.editAccountIndex = undefined;
    }


    getBranchList() {
      const companyId = this.form.get('company_id').value;
      if(this.serv.notNull(companyId)) {
        this.serv.endpoint = 'order-manager/branch?status=active&companyId=' + companyId;
        this.serv.get().subscribe(response => {
          this.branchList = response as any[];
          this.filteredBranchList = this.branchList;
        });
      }
    }

    saveFinaldata() {
        if (this.processingAction) { return; }
        this.validateItemsArray();
        this.validateAccountsArray();
        this.form.markAllAsTouched();
        if (this.form.invalid){
            this.serv.showMessage('Please check data before submit. Delete any unwanted empty rows.', 'error');
            return;
        }
        const formData = {
            ...this.form.value,
            transactionDate: moment(this.form.value.transactionDate).format('YYYY-MM-DD')
        };

        formData.items.forEach(elem => {
            elem.itemId = elem.item.id;
        });
        formData.accounts.forEach(elem => {
            elem.accountId = elem.account.id;
        });

        formData.grandTotal = this.totalHandler.transactionGrandTotal;
        this.processingAction = true;
        this.serv.endpoint = 'account-manager/transaction';
        this.serv.post(formData).subscribe(response => {
            this.serv.showMessage('Entry updated successfully', 'success');
            this.router.navigateByUrl('/admin/account-management/transaction-history');
            this.processingAction = false;
        }, error => {
            this.processingAction = false;
            const msg = 'Can not able to create ' + this.transactionType + ' entry';
            this.serv.handleError(error, msg);
        });
    }
}
