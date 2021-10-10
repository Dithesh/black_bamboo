import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {CustomReportComponent} from './custom-report/custom-report.component';
import {CompanyListResolver} from '../../resolvers/company-list.resolver';
import {ProfitAndLossReportComponent} from "./profit-and-loss-report/profit-and-loss-report.component";

const routes: Routes = [
  {
    path: '',
    children: [

      {
        path: 'account-basic-summary',
        component: CustomReportComponent,
        resolve: {
          companyList: CompanyListResolver
        }
      },
      {
        path: 'profit-and-loss',
        component: ProfitAndLossReportComponent,
        resolve: {
          companyList: CompanyListResolver
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountReportsRoutingModule { }
