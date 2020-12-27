import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CompanyListResolver } from '../../resolvers/company-list.resolver';
import { AccountMasterComponent } from './account-master.component';
import { AccountSettingsManagerComponent } from './account-settings-manager/account-settings-manager.component';
import { InventoryManagerComponent } from './inventory-manager/inventory-manager.component';
import { LedgerManagerComponent } from './ledger-manager/ledger-manager.component';
import { UnitManagerComponent } from './unit-manager/unit-manager.component';


const routes: Routes = [
  {
    path: "",
    component: AccountMasterComponent,
    resolve: {
      companyList: CompanyListResolver
    },
    children: [
      {
        path: "inventory",
        loadChildren: ()=> import('./inventory-manager/inventory-manager.module').then(mod => mod.InventoryManagerModule)
        // component: InventoryManagerComponent
      },
      {
        path: "ledger",
        component: LedgerManagerComponent
      },
      {
        path: "unit",
        component: UnitManagerComponent
      },
      {
        path: "settings",
        component: AccountSettingsManagerComponent
      },
      {
        path: '**',
        redirectTo: 'inventory',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountMasterRoutingModule { }
