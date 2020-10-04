import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ChangePasswordComponent } from 'src/app/admin/layout/component/change-password/change-password.component';
import { ChangeProfileComponent } from 'src/app/admin/layout/component/change-profile/change-profile.component';
import { LayoutService } from 'src/app/admin/layout/services/layout.service';
import { DataService } from 'src/app/shared/services/data.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-kitchen-header',
  templateUrl: './kitchen-header.component.html',
  styleUrls: ['./kitchen-header.component.scss']
})
export class KitchenHeaderComponent implements OnInit {
  url = environment.domain;
  currentUser;
  imgSrc = "url('assets/images/user.png')"
  constructor(
    private router: Router,
    private _serv: DataService) { }

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
      if(this._serv.notNull(response.user.profilePic)){
        
        this.imgSrc = "url(\'"+ this.url + response.user.profilePic +"\')"
      }
    })
  }

  signOut() {
    localStorage.removeItem('lock_token');
    this.router.navigateByUrl('/');
  }
}
