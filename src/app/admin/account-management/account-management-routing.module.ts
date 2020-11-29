import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path: "",
    children: [
      {
        path:"dashboard",
        loadChildren: () => import('./dashboard/dashboard.module').then(mod => mod.DashboardModule)
      },
      {
        path:"new-transaction",
        loadChildren: () => import('./new-transaction/new-transaction.module').then(mod => mod.NewTransactionModule)
      },
      {
        path:"transaction-history",
        loadChildren: () => import('./transaction-history/transaction-history.module').then(mod => mod.TransactionHistoryModule)
      },
      {
        path:"masters",
        loadChildren: () => import('./account-master/account-master.module').then(mod => mod.AccountMasterModule)
      },
      {
        path:"",
        redirectTo:'dashboard',
        pathMatch:'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountManagementRoutingModule { }
