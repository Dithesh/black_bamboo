import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountReportsRoutingModule } from './account-reports-routing.module';
import {CustomReportComponent} from './custom-report/custom-report.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SharedModule} from "../../../shared/shared.module";
import { ProfitAndLossReportComponent } from './profit-and-loss-report/profit-and-loss-report.component';


@NgModule({
  declarations: [CustomReportComponent, ProfitAndLossReportComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    AccountReportsRoutingModule
  ]
})
export class AccountReportsModule { }
