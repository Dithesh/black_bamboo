import { UpdateCompanyComponent } from './company-setting/update-company/update-company.component';
import { CompanySettingComponent } from './company-setting/company-setting.component';
import { CompanyListResolver } from './../resolvers/company-list.resolver';
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
    component: BranchesSettingComponent,
    resolve: {
      companyList: CompanyListResolver
    }
  },
  {
    path:"branches/update",
    component: UpdateBranchComponent,
    resolve: {
      companyList: CompanyListResolver
    }
  },
  {
    path:"branches/update/:id",
    component: UpdateBranchComponent,
    resolve: {
      companyList: CompanyListResolver
    }
  },
  {
    path:"company",
    loadChildren: () => import('./company-setting/company-setting.module').then(m => m.CompanySettingModule)
  },
  {
    path:"categories",
    component:CategoriesSettingComponent
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
