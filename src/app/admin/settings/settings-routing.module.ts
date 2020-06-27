import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BranchesSettingComponent } from './branches-setting/branches-setting.component';
import { CategoriesSettingComponent } from './categories-setting/categories-setting.component';
import { FeedbackSettingComponent } from './feedback-setting/feedback-setting.component';
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
    path:"feedback",
    component:FeedbackSettingComponent
  },
  {
    path:"orders",
    component:OrderSettingComponent
  },
  {
    path:"new-order-type",
    component:AddOrderTypeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
