import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { BehaviorSubject, merge } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { ConfirmPopupComponent } from 'src/app/shared/components/confirm-popup/confirm-popup.component';
import { DataService } from 'src/app/shared/services/data.service';


@Injectable()
export class NewTransactionService {
    form: FormGroup;
    accountList;
    filteredAccountList;
    inventoryList;
    editInventoryIndex=0;
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
            accountId: [''],
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
            itemId: ['', [Validators.required]],
            quantity: ['', [Validators.required, RxwebValidators.numeric, RxwebValidators.minNumber({value: 1})]],
            amount: ['', [Validators.required, RxwebValidators.numeric, RxwebValidators.numeric, RxwebValidators.minNumber({value: 0})]],
            total: ['', [Validators.required, RxwebValidators.numeric]],
            deletedFlag: [false]
        })
        form.get('itemId').valueChanges.subscribe(res => {
            if(form.get('itemId').valid) {
                form.get('amount').setValue(res.pricePerUnit)
            }
        })
        merge(form.get('quantity').valueChanges, form.get('amount').valueChanges).subscribe(response => {
            let quantity = parseFloat(form.get('quantity').value);
            let amount = parseFloat(form.get('amount').value);
            
            if(form.get('quantity').valid && form.get('amount').valid) {
                form.get('total').setValue(quantity * amount)
            }else {
                form.get('total').setValue(0)
            }
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
                        control.get('itemId').setValue('1');
                        control.get('amount').setValue(1);
                        control.get('quantity').setValue(1);
                        control.get('total').setValue(1);
                    }
                    control.get('deletedFlag').setValue(true);
                }else {
                    this.items.removeAt(index);
                }
                this.editInventoryIndex=undefined;
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
    // *accounts transaction handling

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
            transactionDate: new Date()
        })
        this.items.push(this.itemForm());
    }
}