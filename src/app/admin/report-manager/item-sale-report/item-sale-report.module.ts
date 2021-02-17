import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ItemSaleReportRoutingModule } from './item-sale-report-routing.module';
import { ItemSaleReportComponent } from './item-sale-report.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [ItemSaleReportComponent],
  imports: [
    CommonModule,
    ItemSaleReportRoutingModule,
    SharedModule
  ]
})
export class ItemSaleReportModule { }
