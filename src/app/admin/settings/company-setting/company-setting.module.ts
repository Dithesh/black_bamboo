import { UpdateCompanyComponent } from './update-company/update-company.component';
import { CompanySettingComponent } from './company-setting.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompanySettingRoutingModule } from './company-setting-routing.module';
import { ListCompanyComponent } from './list-company/list-company.component';


@NgModule({
  declarations: [ListCompanyComponent, CompanySettingComponent, UpdateCompanyComponent],
  imports: [
    CommonModule,
    CompanySettingRoutingModule,
    SharedModule
  ]
})
export class CompanySettingModule { }
