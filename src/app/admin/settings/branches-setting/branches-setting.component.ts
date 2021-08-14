import { NavigationEnd, ActivatedRoute, Router } from '@angular/router';
import {Component, OnDestroy, OnInit} from '@angular/core';



@Component({
  selector: 'app-branches-setting',
  templateUrl: './branches-setting.component.html',
  styleUrls: ['./branches-setting.component.scss']
})
export class BranchesSettingComponent implements OnInit, OnDestroy {
  editId;
  branchTable = false;
  subscriber;
  constructor(private route: ActivatedRoute, private router: Router){
  }
  ngOnInit(){
    this.editId = this.route.firstChild.snapshot.params.id;
    this.checkPage();
    this.subscriber = this.router.events.subscribe(response => {
      if (response instanceof NavigationEnd){
        this.checkPage();
        this.editId = this.route.firstChild.snapshot.params.id;

      }
    });
  }

  checkPage(){
    if (this.router.url.indexOf('admin/settings/branches/update/tables/') >= 0){
      this.branchTable = true;
    }else {
      this.branchTable = false;
    }
  }

  ngOnDestroy() {
    if (this.subscriber){
      this.subscriber.unsubscribe();
    }
  }
}
