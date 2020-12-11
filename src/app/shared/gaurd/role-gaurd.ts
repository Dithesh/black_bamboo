import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { DataService } from './../services/data.service';

@Injectable({
    providedIn:  'root'
})
export class RoleGaurd implements CanActivate {
  constructor(public _serv: DataService, public router: Router) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let module = route.data.module;
    let mode = route.data.mode;
    let permission = this._serv.getPermission(module, mode);
    if(permission) {
        return true;
    }
    this._serv.showMessage('You don\'t have access to this module', 'error');
    if(this._serv.getUserData()) {
      this.router.navigateByUrl('/admin/dashboard');
    }
    return false;
  }
}