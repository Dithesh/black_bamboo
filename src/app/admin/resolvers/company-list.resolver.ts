import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Injectable } from '@angular/core';
import { DataService } from "../../shared/services/data.service";

@Injectable()
export class CompanyListResolver implements Resolve<any> {
    constructor(private _serv: DataService) {

    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        this._serv.endpoint = "order-manager/company?status=active";
        return this._serv.get();
    }
}