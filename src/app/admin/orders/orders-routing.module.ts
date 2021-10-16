import { OrderListsComponent } from './components/order-lists/order-lists.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrdersComponent } from './orders.component';
import { NewOrderComponent } from './components/new-order/new-order.component';
import { RoleGaurd } from 'src/app/shared/gaurd/role-gaurd';
import {CompanyListResolver} from '../resolvers/company-list.resolver';
import {QuickOrderComponent} from "./components/quick-order/quick-order.component";


const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: OrdersComponent,
        children: [
          {
            path: 'list',
            component: OrderListsComponent,
            resolve: {
              companyList: CompanyListResolver
            },
            data: {
              module: 'orders',
              mode: 'read'
            },
            canActivate: [ RoleGaurd ]
          },
          {
            path: 'quick-order',
            component: QuickOrderComponent,
            resolve: {
              companyList: CompanyListResolver
            },
            data: {
              module: 'orders',
              mode: 'read'
            },
            canActivate: [ RoleGaurd ]
          },
          {
            path: 'update',
            component: NewOrderComponent,
            data: {
              module: 'orders',
              mode: 'read'
            },
            canActivate: [ RoleGaurd ]
          },
          {
            path: 'update/:id',
            component: NewOrderComponent,
            data: {
              module: 'orders',
              mode: 'read'
            },
            canActivate: [ RoleGaurd ]
          },
          {
            path: '**',
            redirectTo: 'list'
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
