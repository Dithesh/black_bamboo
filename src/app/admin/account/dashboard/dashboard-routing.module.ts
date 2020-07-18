import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';


const routes: Routes = [
  {
    path: "",
    component: DashboardComponent,
    // children: [
    //   {
    //     path: "purchase-transaction",
    //     component: PurchaseTransactionComponent
    //   },
    //   {
    //     path: "**",
    //     pathMatch: 'full',
    //     redirectTo: "purchase-transaction"
    //   },
    // ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
