import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { CategoriesSettingComponent } from '../categories-setting/categories-setting.component';
import { BranchesSettingComponent } from './branches-setting/branches-setting.component';
import { OrderSettingComponent } from './order-setting/order-setting.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AddOrderTypeComponent } from './add-order-type/add-order-type.component';


@NgModule({
  declarations: [CategoriesSettingComponent, BranchesSettingComponent, OrderSettingComponent, AddOrderTypeComponent],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    SharedModule
  ]
})
export class SettingsModule { }
