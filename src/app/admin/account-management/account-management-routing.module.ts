import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoleGaurd } from 'src/app/shared/gaurd/role-gaurd';


const routes: Routes = [
  {
    path: '',
    data: {
      module: 'accounting-menu',
      mode: 'full'
    },
    canActivate: [ RoleGaurd ],
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.module').then(mod => mod.DashboardModule)
      },
      {
        path: 'new-transaction',
        loadChildren: () => import('./new-transaction/new-transaction.module').then(mod => mod.NewTransactionModule),
        data: {
          module: 'accounting-transaction',
          mode: 'full'
        },
        canActivate: [ RoleGaurd ]
      },
      {
        path: 'transaction-history',
        loadChildren: () => import('./transaction-history/transaction-history.module').then(mod => mod.TransactionHistoryModule),
        data: {
          module: 'accounting-transaction',
          mode: 'full'
        },
        canActivate: [ RoleGaurd ]
      },
      {
        path: 'inventory',
        loadChildren: () => import('./inventory-manager/inventory-manager.module').then(mod => mod.InventoryManagerModule)
        // component: InventoryManagerComponent
      },
      {
        path: 'masters',
        loadChildren: () => import('./account-master/account-master.module').then(mod => mod.AccountMasterModule),
        data: {
          module: 'accounting-masters',
          mode: 'full'
        },
        canActivate: [ RoleGaurd ]
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountManagementRoutingModule { }
