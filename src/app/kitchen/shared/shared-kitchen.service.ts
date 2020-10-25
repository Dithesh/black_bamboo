import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class SharedKitchenService {
    branch_id;
    kitchen_details;
    kirchenChangeService=new Subject<boolean>()
    consolidatedProducts:any[]=[];
    constructor() {
        this.kirchenChangeService.next(false);
    }

}