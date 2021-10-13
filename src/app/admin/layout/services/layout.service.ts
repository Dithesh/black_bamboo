import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class LayoutService {
    isOpened=true;
    menuMode='side';
    isFixedMenu=false;

    constructor() {
        this.handleIsOpened();
    }

    handleIsOpened() {
        if(window.innerWidth < 1360) {
            this.isOpened = false;
            this.menuMode = 'over';
            this.isFixedMenu=true;
        }else {
            this.isOpened = true;
            this.menuMode = 'side';
            this.isFixedMenu=false;
        }
    }
}
