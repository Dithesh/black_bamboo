import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ChangePasswordComponent } from 'src/app/admin/layout/component/change-password/change-password.component';
import { ChangeProfileComponent } from 'src/app/admin/layout/component/change-profile/change-profile.component';
import { LayoutService } from 'src/app/admin/layout/services/layout.service';
import { DataService } from 'src/app/shared/services/data.service';
import { environment } from 'src/environments/environment';
import { SharedKitchenService } from '../../shared/shared-kitchen.service';

@Component({
  selector: 'app-kitchen-header',
  templateUrl: './kitchen-header.component.html',
  styleUrls: ['./kitchen-header.component.scss']
})
export class KitchenHeaderComponent implements OnInit {
  url = environment.domain;
  currentUser;
  imgSrc = "url('assets/images/user.png')"
  branchDetails: any;
  constructor(
    private router: Router,
    private _serv: DataService,
    public _kitchen: SharedKitchenService) { }

  ngOnInit(): void {
    this.getCurrentUser();
  }
  changePassword() {
    // this.dialog.open(ChangePasswordComponent);
  }
  changeProfile() {
    // let dialogRef = this.dialog.open(ChangeProfileComponent, {
    //   data: {
    //     image: this.imgSrc
    //   }
    // });

    // dialogRef.afterClosed().subscribe(this.getCurrentUser.bind(this))
  }

  getCurrentUser() {
    this._serv.endpoint="current-user";
    this._serv.get().subscribe((response:any) => {
      this.currentUser = response;
      this.getBranchDetail(this.currentUser.user.branch_id)
      if(this._serv.notNull(response.user.profilePic)){
        
        this.imgSrc = "url(\'"+ this.url + response.user.profilePic +"\')"
      }
    })
  }

  getBranchDetail(branch_id) {
    this._serv.endpoint="order-manager/branch/"+branch_id;
    this._serv.get().subscribe((response:any) => {
      this.branchDetails=response;
      if(this.branchDetails.kitchens && this.branchDetails.kitchens.length > 0) {
        this._kitchen.kitchen_details = this.branchDetails.kitchens[0]
        this._kitchen.kirchenChangeService.next(true);
      }
    })
  }

  onChangeKitchen(item) {
    this._kitchen.kitchen_details = item;
    this._kitchen.kirchenChangeService.next(true);
  }

  signOut() {
    localStorage.removeItem('lock_token');
    this.router.navigateByUrl('/');
  }
}
