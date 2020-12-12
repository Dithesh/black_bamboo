import { Component, OnInit } from '@angular/core';
import { LayoutService } from '../services/layout.service';
import { MatDialog } from '@angular/material/dialog';
import { ChangePasswordComponent } from '../component/change-password/change-password.component';
import { ChangeProfileComponent } from '../component/change-profile/change-profile.component';
import { Router } from '@angular/router';
import { DataService } from 'src/app/shared/services/data.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  url = environment.imgUrl;
  currentUser;
  imgSrc = "url('assets/images/user.png')"
  constructor(
    public _layout: LayoutService, 
    private dialog:MatDialog, 
    private router: Router,
    private _serv: DataService) { }

  ngOnInit(): void {
    this.getCurrentUser();
  }
  changePassword() {
    this.dialog.open(ChangePasswordComponent);
  }
  changeProfile() {
    let dialogRef = this.dialog.open(ChangeProfileComponent, {
      data: {
        image: this.imgSrc
      }
    });

    dialogRef.afterClosed().subscribe(this.getCurrentUser.bind(this))
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
    localStorage.clear();
    localStorage.removeItem('lock_token');
    this.router.navigateByUrl('/guest/signin');
  }
}
