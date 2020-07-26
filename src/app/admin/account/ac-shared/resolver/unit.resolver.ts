import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { DataService } from './../../../../shared/services/data.service';
import { Injectable } from '@angular/core';

@Injectable()
export class UnitResolver implements Resolve<any> {
    constructor(private _serv: DataService) {

    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        this._serv.endpoint = "account-manager/unit"
        return this._serv.get();
    }
}