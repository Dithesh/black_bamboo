import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportManagerRoutingModule } from './report-manager-routing.module';
import { ReportManagerComponent } from './report-manager.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [ReportManagerComponent],
  imports: [
    CommonModule,
    ReportManagerRoutingModule,
    SharedModule
  ]
})
export class ReportManagerModule { }
