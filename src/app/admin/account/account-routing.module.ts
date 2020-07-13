import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashbordComponent } from './dashbord/dashbord.component';
import { MakeTransactionComponent } from './make-transaction/make-transaction.component';
import { ReportComponent } from './report/report.component';
import { TransactionListComponent } from './transaction-list/transaction-list.component';
import { AccountsComponent } from './accounts/accounts.component';


const routes: Routes = [
  {
    path:"",
    redirectTo:'dashbord',
    pathMatch:'full'
  },
  {
    path:"dashbord",
    component:DashbordComponent
  },
  {
    path:"make-transaction",
    component:MakeTransactionComponent
  },
  {
    path:"report",
    component:ReportComponent
  },
  {
    path:"transactionlist",
    component:TransactionListComponent
  },
  {
    path:"account",
    component:AccountsComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
