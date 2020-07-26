import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportManagerRoutingModule } from './report-manager-routing.module';
import { ReportManagerComponent } from './report-manager.component';


@NgModule({
  declarations: [ReportManagerComponent],
  imports: [
    CommonModule,
    ReportManagerRoutingModule
  ]
})
export class ReportManagerModule { }
