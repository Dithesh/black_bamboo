import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MasterGlobalService } from '../services/master-global.service';

@Component({
  selector: 'app-account-master',
  templateUrl: './account-master.component.html',
  styleUrls: ['./account-master.component.scss']
})
export class AccountMasterComponent implements OnInit, OnDestroy {
  currentModule;
  routeEventSubscriber;
  constructor(private router: Router, private global: MasterGlobalService) {
    this.handleCurrentModuleIdentification();
    this.routeEventSubscriber = this.router.events.subscribe(response => {
      this.handleCurrentModuleIdentification();
    })
  }

  ngOnInit(): void {
  }

  handleCurrentModuleIdentification() {
    const url = this.router.url.split('/');
    this.currentModule = url[url.length - 1];
  }

  onAddClick() {
    if(this.currentModule === 'inventory') {
      this.router.navigateByUrl('/admin/account-management/masters/inventory/update');
      // this._global.inventoryAdd.next(true);
    } else if(this.currentModule === 'ledger') {
      this.global.ledgerAdd.next(true);
    } else if(this.currentModule === 'unit') {
      this.global.unitAdd.next(true);
    }
  }



  ngOnDestroy() {
    if (this.routeEventSubscriber) {
      this.routeEventSubscriber.unsubscribe();
    }
  }

}
