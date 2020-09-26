import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { KitchenComponent } from './kitchen.component';


const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: "",
        component: KitchenComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KitchenRoutingModule { }
