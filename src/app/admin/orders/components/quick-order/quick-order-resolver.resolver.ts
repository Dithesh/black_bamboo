import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import {forkJoin, Observable, of} from 'rxjs';
import {DataService} from '../../../../shared/services/data.service';
import {environment} from '../../../../../environments/environment';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class QuickOrderResolverResolver implements Resolve<any> {
  constructor(
    private serv: DataService
  ) {
  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {

    const userData = this.serv.getUserData();
    if (userData.roles !== 'Super Admin' && userData.roles !== 'Company Admin') {
      return forkJoin([
        this.serv.http.get(environment.apiUrl + 'order-manager/branch/' + userData.branch_id),
        this.serv.http.get(environment.apiUrl + 'order-manager/product/category-based-product'),
        this.serv.http.get(environment.apiUrl + 'order-manager/product-combo?status=active'),
        this.serv.http.get(environment.apiUrl + 'order-manager/favorite-menu?items=required&status=active&timBased=required'),
      ]).pipe(
        map(data => {
          return {
            branchDetails: data[0],
            productList: data[1],
            comboList: data[2],
            favItems: data[3],
          };
        })
      );
    } else {
      return of({
            branchDetails: null,
            productList: [],
            comboList: [],
            favItems: []
          });
    }
  }
}
