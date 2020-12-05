import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountReportsRoutingModule } from './account-reports-routing.module';
import { AccountReportsComponent } from './account-reports.component';
import { CustomReportComponent } from './custom-report/custom-report.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [AccountReportsComponent, CustomReportComponent],
  imports: [
    CommonModule,
    AccountReportsRoutingModule,
    SharedModule
  ]
})
export class AccountReportsModule { }
