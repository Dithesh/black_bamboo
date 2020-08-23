import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrdersComponent } from './orders.component';
import { NewOrderComponent } from './components/new-order/new-order.component';
import { TablePageComponent } from './components/table-page/table-page.component';
import { TakeAwayPageComponent } from './components/take-away-page/take-away-page.component';


const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: "",
        component: OrdersComponent
      },
      {
        path: "new",
        component:NewOrderComponent
      },
      {
        path: "update/:id",
        component:NewOrderComponent
      },
      // {
      //   path:"table",
      //   component:TablePageComponent
      // },
      // {
      //   path:"take-away",
      //   component:TakeAwayPageComponent
      // }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdersRoutingModule { }
