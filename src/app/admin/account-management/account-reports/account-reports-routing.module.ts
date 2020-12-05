import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CompanyListResolver } from '../../resolvers/company-list.resolver';
import { AccountReportsComponent } from './account-reports.component';
import { CustomReportComponent } from './custom-report/custom-report.component';


const routes: Routes = [
  {
    path: "",
    component: AccountReportsComponent,
    children: [
      {
        path: "custom",
        component: CustomReportComponent,
        resolve: {
          companyList: CompanyListResolver
        }
      },
      {
        path: '**',
        redirectTo: 'custom',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountReportsRoutingModule { }
