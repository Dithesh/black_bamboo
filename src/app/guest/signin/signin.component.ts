import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/shared/services/data.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {
  form:FormGroup;
  constructor(private _serv: DataService, private fb: FormBuilder, private router: Router) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    })
  }

  signIn(event) {
    event.preventDefault();
    this.form.markAllAsTouched();
    if(this.form.invalid)return;
    this._serv.endpoint="auth/signin";
    this._serv.post(this.form.value).subscribe(response => {
      localStorage.setItem('lock_token', response['token'])
      this.router.navigateByUrl('/admin/dashboard')
      this._serv.showMessage("Logged in successfully.", 'success');
    }, ({error}) => {
      this._serv.showMessage(error['msg'], 'error');
    })
  }



}
