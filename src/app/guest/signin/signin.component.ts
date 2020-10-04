import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/shared/services/data.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {
  form:FormGroup;
  adminRoles=['Super Admin', 'Admin', 'Accountant', 'Order Manager', 'Branch Manager'];
  kitchenRoles=['Admin', 'Branch Manager', 'Order Manager', 'Kitchen Manager'];
  routeType='admin';
  constructor(private _serv: DataService, private fb: FormBuilder, private router: Router, private route: ActivatedRoute) { 
    if(this.router.url.indexOf('/kitchen/guest/signin') >= 0) {
      this.routeType='kitchen';
    }
  }

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
      let decoded = this._serv.deocodeToken(response['token']);
      if(this.routeType == 'admin') {
        if(this.adminRoles.indexOf(decoded.roles) >= 0) {
          localStorage.setItem('lock_token', response['token'])
          this.router.navigateByUrl('/admin/dashboard')
          this._serv.showMessage("Logged in successfully.", 'success');
        }else {
          this._serv.showMessage("Access denied", 'error');
        }
      }else if(this.routeType == 'kitchen') {
        if(this.kitchenRoles.indexOf(decoded.roles) >= 0) {
          localStorage.setItem('kitchen_lock_token', response['token'])
          this.router.navigateByUrl('/kitchen/dashboard')
          this._serv.showMessage("Logged in successfully.", 'success');
        }else {
          this._serv.showMessage("Access denied", 'error');
        }
      }
    }, ({error}) => {
      this._serv.showMessage(error['msg'], 'error');
    })
  }



}
