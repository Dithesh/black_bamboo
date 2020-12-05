import { OrderListsComponent } from './components/order-lists/order-lists.component';
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
        component: OrdersComponent,
        children:[
          {
            path:"list",
            component:OrderListsComponent
          },
          {
            path: "update",
            component:NewOrderComponent
          },
          {
            path: "update/:id",
            component:NewOrderComponent
          },
          {
            path:"**",
            redirectTo:"list"
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdersRoutingModule { }
