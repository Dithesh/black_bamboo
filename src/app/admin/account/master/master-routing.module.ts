import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MasterComponent } from './master.component';
import { LedgerAccountsComponent } from './ledger-accounts/ledger-accounts.component';
import { InventoryComponent } from './inventory/inventory.component';
import { UnitsComponent } from './units/units.component';
import { UnitResolver } from '../ac-shared/resolver/unit.resolver';


const routes: Routes = [
  {
    path: "",
    component: MasterComponent,
    children: [
      {
        path: "ledger",
        component: LedgerAccountsComponent
      },
      {
        path: "inventory",
        component: InventoryComponent,
        resolve: {
          units: UnitResolver
        }
      },
      {
        path: "unit",
        component: UnitsComponent
      },
      {
        path: "**",
        pathMatch: 'full',
        redirectTo: "ledger"
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterRoutingModule { }
