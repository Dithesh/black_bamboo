import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { DataService } from '../../shared/services/data.service';
import { of } from 'rxjs';

@Injectable()
export class CompanyListResolver implements Resolve<any> {
    constructor(private serv: DataService) {

    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        this.serv.endpoint = 'order-manager/company?status=active';
        const userData = this.serv.getUserData();
        if (userData.roles === 'Super Admin') {
            return this.serv.get();
        }
        return of([]);

    }
}
