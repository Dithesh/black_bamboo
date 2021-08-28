import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TransactionHistoryComponent } from './transaction-history.component';
import {CompanyListResolver} from '../../resolvers/company-list.resolver';


const routes: Routes = [
  {
    path: '',
    component: TransactionHistoryComponent,
    resolve: {
      companyList: CompanyListResolver
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransactionHistoryRoutingModule { }
