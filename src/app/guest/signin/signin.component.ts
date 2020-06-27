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
    this._serv.endpoint="token/";
    this._serv.post(this.form.value).subscribe(response => {
      console.log(response);
      localStorage.setItem('lock_token', response['access'])
      localStorage.setItem('refr_token', response['refresh'])
      this.router.navigateByUrl('/admin/dashboard')
    })
  }



}
