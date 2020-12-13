import { UpdateCompanyComponent } from './company-setting/update-company/update-company.component';
import { CompanySettingComponent } from './company-setting/company-setting.component';
import { CompanyListResolver } from './../resolvers/company-list.resolver';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BranchesSettingComponent } from './branches-setting/branches-setting.component';
import { CategoriesSettingComponent } from './categories-setting/categories-setting.component';
import { AddTableManagerComponent } from './add-table-manager/add-table-manager.component';


const routes: Routes = [
  {
    path:"",
    redirectTo:'categories',
    pathMatch:'full'
  },
  {
    path:"branches",
    loadChildren:() => import('./branches-setting/branches-setting.module').then(m=>m.BranchesSettingModule)
  },
  {
    path:"company",
    loadChildren: () => import('./company-setting/company-setting.module').then(m => m.CompanySettingModule)
  },
  {
    path:"categories",
    loadChildren: () => import('./categories-setting/categories-setting.module').then(m => m.CategoriesSettingModule)
  },
  {
    path:"table-manager",
    component:AddTableManagerComponent,
    resolve: {
      companyList: CompanyListResolver
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
