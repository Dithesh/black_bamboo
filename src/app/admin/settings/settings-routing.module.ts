import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BranchesSettingComponent } from './branches-setting/branches-setting.component';
import { CategoriesSettingComponent } from './categories-setting/categories-setting.component';
import { AddTableManagerComponent } from './add-table-manager/add-table-manager.component';


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
    path:"table-manager",
    component:AddTableManagerComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
