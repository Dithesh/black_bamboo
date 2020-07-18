import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path: "",
    children: [
      {
        path:"",
        redirectTo:'dashboard',
        pathMatch:'full'
      },
      {
        path:"dashboard",
        loadChildren: () => import('./dashboard/dashboard.module').then(mod => mod.DashboardModule)
      },
      {
        path:"transaction",
        loadChildren: () => import('./transaction/transaction.module').then(mod => mod.TransactionModule)
      },
      {
        path:"reports",
        loadChildren: () => import('./reports/reports.module').then(mod => mod.ReportsModule)
      },
      {
        path:"master",
        loadChildren: () => import('./master/master.module').then(mod => mod.MasterModule)
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
