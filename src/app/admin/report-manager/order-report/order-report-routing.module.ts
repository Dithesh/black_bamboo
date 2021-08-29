import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrderReportComponent } from './order-report.component';
import {CompanyListResolver} from '../../resolvers/company-list.resolver';

const routes: Routes = [
  {
    path: '',
    resolve: {
      companyList: CompanyListResolver
    },
    component: OrderReportComponent
  }
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderReportRoutingModule { }
