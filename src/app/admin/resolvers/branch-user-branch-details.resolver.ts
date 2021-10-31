import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { DataService } from '../../shared/services/data.service';
import { of } from 'rxjs';

@Injectable()
export class BranchUserBranchDetailsResolver implements Resolve<any> {
    constructor(private serv: DataService) {

    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const userData = this.serv.getUserData();
        this.serv.endpoint = 'order-manager/branch/1';
        return this.serv.get();

    }
}
