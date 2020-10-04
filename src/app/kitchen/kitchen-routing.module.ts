import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { KitchenComponent } from './kitchen.component';


const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: "dashboard",
        component: KitchenComponent,
        loadChildren: () => import('./../kitchen/kitchen-dashboard/kitchen-dashboard.module').then(mod => mod.KitchenDashboardModule),
      },
      {
        path: "guest",
        loadChildren: () => import('./../guest/guest.module').then(mod => mod.GuestModule),
      },
      {
        path: "**",
        redirectTo: "guest",
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KitchenRoutingModule { }
