import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDividerModule } from '@angular/material/divider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {MatRippleModule} from '@angular/material/core';

import { AdminComponent } from './admin.component';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { ChangePasswordComponent } from './layout/component/change-password/change-password.component';
import { ChangeProfileComponent } from './layout/component/change-profile/change-profile.component';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [AdminComponent, HeaderComponent, FooterComponent, SidebarComponent, ChangePasswordComponent, ChangeProfileComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    MatSidenavModule,
    MatDividerModule,
    MatToolbarModule,
    SharedModule
  ],
  entryComponents: [ChangePasswordComponent, ChangeProfileComponent],
  providers:[
    MatDialogModule,
  ]
})
export class AdminModule { }
