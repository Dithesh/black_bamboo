import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ItemSaleReportComponent } from './item-sale-report.component';

const routes: Routes = [{ path: '', component: ItemSaleReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItemSaleReportRoutingModule { }
