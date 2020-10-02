import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BranchesSettingComponent } from './branches-setting/branches-setting.component';
import { CategoriesSettingComponent } from './categories-setting/categories-setting.component';
import { AddTableManagerComponent } from './add-table-manager/add-table-manager.component';
import { UpdateBranchComponent } from './branches-setting/update-branch/update-branch.component';


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
    path:"branches/update",
    component: UpdateBranchComponent
  },
  {
    path:"branches/update/:id",
    component: UpdateBranchComponent
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
