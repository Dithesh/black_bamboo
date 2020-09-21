import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrdersComponent } from './orders.component';
import { NewOrderComponent } from './components/new-order/new-order.component';


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
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdersRoutingModule { }
