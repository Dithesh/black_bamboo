import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrderReportComponent } from './order-report.component';

const routes: Routes = [{ path: '', component: OrderReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderReportRoutingModule { }
