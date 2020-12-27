import { InventoryDetailsComponent } from './inventory-details/inventory-details.component';
import { UpdateInventoryManagerComponent } from './update-inventory-manager/update-inventory-manager.component';
import { InventoryManagerComponent } from './inventory-manager.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path:"",
    component:InventoryManagerComponent
  },
  {
    path:"view/:id",
    component:InventoryDetailsComponent
  },
  {
    path:"update",
    component:UpdateInventoryManagerComponent
  },
  {
    path:"update/:id",
    component:UpdateInventoryManagerComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventoryManagerRoutingModule { }
