import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path: "",
    children: [
      {
        path:"",
        redirectTo:'dashboard',
        pathMatch:'full'
      },
      {
        path:"dashboard",
        loadChildren: () => import('./dashboard/dashboard.module').then(mod => mod.DashboardModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountManagementRoutingModule { }
