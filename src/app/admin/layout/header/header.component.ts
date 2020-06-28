import { Component, OnInit } from '@angular/core';
import { LayoutService } from '../services/layout.service';
import { MatDialog } from '@angular/material/dialog';
import { ChangePasswordComponent } from '../component/change-password/change-password.component';
import { ChangeProfileComponent } from '../component/change-profile/change-profile.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(public _layout: LayoutService, private dialog:MatDialog) { }

  ngOnInit(): void {
  }
  changePassword() {
    this.dialog.open(ChangePasswordComponent);
  }
  changeProfile() {
    this.dialog.open(ChangeProfileComponent);
  }
}
