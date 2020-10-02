import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { CategoriesSettingComponent } from './categories-setting/categories-setting.component';
import { BranchesSettingComponent } from './branches-setting/branches-setting.component';
import { OrderSettingComponent } from './order-setting/order-setting.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AddOrderTypeComponent } from './add-order-type/add-order-type.component';
import { AddTableManagerComponent } from './add-table-manager/add-table-manager.component';
import { UpdateBranchComponent } from './branches-setting/update-branch/update-branch.component';


@NgModule({
  declarations: [CategoriesSettingComponent, BranchesSettingComponent, OrderSettingComponent, AddOrderTypeComponent, AddTableManagerComponent, UpdateBranchComponent],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    SharedModule
  ]
})
export class SettingsModule { }
