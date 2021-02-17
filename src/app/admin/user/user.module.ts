import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { UserListComponent } from './user-list/user-list.component';
import { UpdateUserComponent } from './update-user/update-user.component';
import { ChangePasswordComponent } from './change-password/change-password.component';


@NgModule({
  declarations: [UserComponent, UserListComponent, UpdateUserComponent,ChangePasswordComponent],
  entryComponents: [
    ChangePasswordComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    SharedModule
  ]
})
export class UserModule { }
