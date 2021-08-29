import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ItemSaleReportComponent } from './item-sale-report.component';
import {CompanyListResolver} from '../../resolvers/company-list.resolver';

const routes: Routes = [
  {
    path: '',
    resolve: {
      companyList: CompanyListResolver
    },
    component: ItemSaleReportComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItemSaleReportRoutingModule { }
