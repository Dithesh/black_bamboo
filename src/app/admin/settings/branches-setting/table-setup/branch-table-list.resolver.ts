import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import {DataService} from '../../../../shared/services/data.service';

@Injectable({
  providedIn: 'root'
})
export class BranchTableListResolver implements Resolve<any> {
  constructor(private serv: DataService) {
  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    this.serv.endpoint = 'order-manager/table-manager?pageNumber=1&branchId=' + route.params.id;
    return this.serv.get();
  }
}
