import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportsComponent } from './reports.component';


const routes: Routes = [
  {
    path: "",
    component: ReportsComponent,
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
export class ReportsRoutingModule { }
