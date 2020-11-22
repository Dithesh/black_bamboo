import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


@Injectable()
export class MasterGlobalService {
    inventoryAdd = new BehaviorSubject(false);
    ledgerAdd = new BehaviorSubject(false);
    unitAdd = new BehaviorSubject(false);
    constructor(){}
}