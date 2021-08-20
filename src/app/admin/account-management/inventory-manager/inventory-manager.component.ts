import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-inventory-manager',
  templateUrl: './inventory-manager.component.html',
  styleUrls: ['./inventory-manager.component.scss']
})
export class InventoryManagerComponent implements OnInit, OnDestroy {
  currentUrl = 'list';
  private editId: any;
  private eventSubscriber: Subscription;

  constructor(private router: Router, private route: ActivatedRoute) {
    this.handleURL();
    this.eventSubscriber = this.router.events.subscribe(response => {
      if (response instanceof NavigationEnd) {
        this.handleURL();
      }
    });
  }

  ngOnInit() {
  }

  handleURL() {
    if(this.route.firstChild.snapshot) {
      this.editId = this.route.firstChild.snapshot.params.id;
    }
    if (this.router.url.indexOf('/admin/account-management/inventory/update/') >= 0 && this.editId) {
      this.currentUrl = 'edit';
    }else if (this.router.url.indexOf('/admin/account-management/inventory/list/view/') >= 0 && this.editId) {
      this.currentUrl = 'view';
    }else {
      this.currentUrl = 'list';
    }
  }

  ngOnDestroy() {
    if (this.eventSubscriber){
      this.eventSubscriber.unsubscribe()
    }
  }


}
