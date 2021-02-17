import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderReportRoutingModule } from './order-report-routing.module';
import { OrderReportComponent } from './order-report.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [OrderReportComponent],
  imports: [
    CommonModule,
    OrderReportRoutingModule,
    SharedModule
  ]
})
export class OrderReportModule { }
