import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BranchesSettingComponent } from './branches-setting/branches-setting.component';
import { CategoriesSettingComponent } from './categories-setting/categories-setting.component';
import { OrderSettingComponent } from './order-setting/order-setting.component';
import { AddOrderTypeComponent } from './add-order-type/add-order-type.component';


const routes: Routes = [
  {
    path:"",
    redirectTo:'branches',
    pathMatch:'full'
  },
  {
    path:"branches",
    component: BranchesSettingComponent
  },
  {
    path:"categories",
    component:CategoriesSettingComponent
  },
  {
    path:"order-type",
    component:OrderSettingComponent
  },
  {
    path:"order-type/update",
    component:AddOrderTypeComponent
  },
  {
    path:"order-type/update/:id",
    component:AddOrderTypeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
