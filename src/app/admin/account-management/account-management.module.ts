import { AccountManagementRoutingModule } from './account-management-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MasterGlobalService } from './services/master-global.service';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AccountManagementRoutingModule
  ],
  providers: [
    MasterGlobalService
  ]
})
export class AccountManagementModule { }
