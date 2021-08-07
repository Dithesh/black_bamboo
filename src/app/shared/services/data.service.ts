import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../../environments/environment';
import { SnackService } from './snack.service';
import { AbstractControl } from '@angular/forms';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { permissions } from './permission-config';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  apiUrl = environment.apiUrl;
  endpoint = '';
  constructor(private http: HttpClient
    ,         private snakBar: SnackService, private router: Router) { }

  get() {
    return this.http.get(this.apiUrl + this.endpoint);
  }

  post(data) {
    return this.http.post(this.apiUrl + this.endpoint, data);
  }

  put(data) {
    return this.http.put(this.apiUrl + this.endpoint, data);
  }

  delete() {
    return this.http.delete(this.apiUrl + this.endpoint);
  }

  formArrayCount(formArray) {
    let count = 0;
    formArray.controls.forEach(elem => {
      if (!elem.get('deletedFlag').value) {
        count++;
      }
    });
    return count;
  }

  showMessage(message, type) {
    this.snakBar.openSnackBar(message, 'close', type);
  }

  autoCompleteMatch(control: AbstractControl) {
      const selection: any = control.value;

      if (typeof selection === 'string' && selection != '') {
          return { incorrect: true };
      }
      return null;
  }

  notNull(value) {
    return value != '' && value != null && value != undefined;
  }

  getUserData(key  = 'lock_token') {
    const token = localStorage.getItem(key);
    return this.deocodeToken(token);
  }

  deocodeToken(token) {
    if (this.notNull(token)) {
      const helper = new JwtHelperService();
      const decoded = helper.decodeToken(token);
      if (helper.isTokenExpired(token)){
        this.router.navigateByUrl('/guest/signin');
        return;
      }
      // user_id, roles
      return decoded;

    }else {
      this.router.navigateByUrl('/guest/signin');
      return undefined;
    }
  }

  handleError({error}, defaultMsg= 'Could not able to process') {
    if (error.hasOwnProperty('errors')) {
      this.showMessage(error.errors[Object.keys(error.errors)[0]][0], 'error');
    }else if (error.hasOwnProperty('msg')) {
      this.showMessage(error.msg, 'error');
    }else {
      this.showMessage(defaultMsg, 'error');
    }
  }

  timerUpdate(order){
    return setInterval(() => {
      order.timeDif.i++;
      if (order.minutes >= 60) {
        order.timeDif.h++;
      }
    }, 60000);
  }

  getPermission(module, mode= 'read') {
    const userData = this.getUserData();
    let permission;
    try {
      permission =  permissions[module][userData.roles];
    }catch (e) {
      return false;
    }
    if (permission == 'full') {
      return true;
    }else if (mode == 'read' && permission == 'read'){
      return true;
    }
    return false;
  }
}
