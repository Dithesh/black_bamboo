import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class LayoutService {
    isOpened=true;
    menuMode='side';
    isFixedMenu=false;

    constructor() {
        if(window.innerWidth < 768) {
            this.isOpened = false;
            this.menuMode = 'over';
            this.isFixedMenu=true;
        }
    }
}