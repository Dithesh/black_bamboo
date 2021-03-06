import { OrderListsComponent } from './components/order-lists/order-lists.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrdersComponent } from './orders.component';
import { NewOrderComponent } from './components/new-order/new-order.component';
import { RoleGaurd } from 'src/app/shared/gaurd/role-gaurd';


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
            component:OrderListsComponent,
            data: {
              module: 'orders',
              mode: 'read'
            },
            canActivate: [ RoleGaurd ]
          },
          {
            path: "update",
            component:NewOrderComponent,
            data: {
              module: 'orders',
              mode: 'read'
            },
            canActivate: [ RoleGaurd ]
          },
          {
            path: "update/:id",
            component:NewOrderComponent,
            data: {
              module: 'orders',
              mode: 'read'
            },
            canActivate: [ RoleGaurd ]
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
