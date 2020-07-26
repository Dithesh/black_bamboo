import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DataService } from 'src/app/shared/services/data.service';
import { MatDialogRef } from '@angular/material/dialog';
import { RxwebValidators } from '@rxweb/reactive-form-validators';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  form: FormGroup;
  constructor(
    private fb: FormBuilder,
    private _serv: DataService,
    private dialogRef: MatDialogRef<ChangePasswordComponent>
  ) { 
    this.form = this.fb.group({
      oldPassword: ['', [Validators.required]],
      password: ['', [Validators.required]],
      confirmPassword: ['',[Validators.required, RxwebValidators.compare({fieldName:'password' })]]
    })
  }

  ngOnInit(): void {
  }

  changePassword(event) {
    event.preventDefault();
    this.form.markAllAsTouched();
    if(this.form.invalid)return;
    this._serv.endpoint = "order-manager/user/change-current-user-password";
    this._serv.post(this.form.value).subscribe(response => {
      this._serv.showMessage('Password changed successfully.', 'success');
      this.dialogRef.close();
    }, ({error}) => {
      this._serv.showMessage(error['msg'], 'error');
    })
  }

}
