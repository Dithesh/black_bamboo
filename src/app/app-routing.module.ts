import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path: "admin",
    loadChildren: () => import('./admin/admin.module').then(mod => mod.AdminModule),
  },
  {
    path: "guest",
    loadChildren: () => import('./guest/guest.module').then(mod => mod.GuestModule),
  },
  {
    path: "kitchen",
    loadChildren: () => import('./kitchen/kitchen.module').then(mod => mod.KitchenModule),
  },
  {
    path: "",
    redirectTo:'/guest/signin',
    pathMatch:'full'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: false })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
