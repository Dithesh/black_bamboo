import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { DataService } from './../services/data.service';

@Injectable({
    providedIn:  'root'
})
export class RoleGaurd implements CanActivate {
  constructor(public _serv: DataService, public router: Router) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    console.log('let');
    let module = route.data.module;
    let mode = route.data.mode;
    let permission = this._serv.getPermission(module, mode);
    if(permission) {
        return true;
    }
    this._serv.showMessage('You done have access to this module', 'error');
    this.router.navigateByUrl('/admin/dashboard');
    return false;
  }
}