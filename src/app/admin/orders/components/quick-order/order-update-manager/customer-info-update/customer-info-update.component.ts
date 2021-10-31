import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {RxwebValidators} from "@rxweb/reactive-form-validators";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-customer-info-update',
  templateUrl: './customer-info-update.component.html',
  styleUrls: ['./customer-info-update.component.scss']
})
export class CustomerInfoUpdateComponent implements OnInit, OnDestroy {
  form: FormGroup = this.fb.group({
    mobileNumber: ['', [Validators.required, RxwebValidators.pattern({ expression: {mobileNumber: /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[789]\d{9}$/}})]],
    customerName: [''],
    customerAddress: [''],
    relatedInfo: ['']
  });
  subscription: Subscription = new Subscription();
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CustomerInfoUpdateComponent>,
    @Inject(MAT_DIALOG_DATA) private data
  ) {
    this.form.patchValue(this.data.formValue);
  }

  ngOnInit(): void {
    this.subscription.add(this.form.get('mobileNumber').valueChanges.subscribe(response => {
      if (!response) {
        this.form.patchValue({
          customerName: '',
          customerAddress: '',
          relatedInfo: ''
        })
      }
    }))
  }

  close() {
    this.dialogRef.close();
  }

  saveData() {
    this.dialogRef.close(this.form.value);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
