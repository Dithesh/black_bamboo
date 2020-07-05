import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin.component';


const routes: Routes = [
  {
    path: "",
    component: AdminComponent,
    children: [
      {
        path: "dashboard",
        loadChildren: () => import('./dashboard/dashboard.module').then(mod => mod.DashboardModule)
      },
      {
        path: "order",
        loadChildren: () => import('./orders/orders.module').then(mod => mod.OrdersModule)
      },
      {
        path :"settings",
        loadChildren: () => import('./settings/settings.module').then(mod => mod.SettingsModule)
      },
      {
        path:"products",
        loadChildren: () => import('./products/products.module').then(mod => mod.ProductsModule)
      },
      {
        path:"user",
        loadChildren: () => import('./user/user.module').then(mod => mod.UserModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
