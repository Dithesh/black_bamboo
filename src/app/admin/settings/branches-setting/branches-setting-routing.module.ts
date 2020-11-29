import { CompanyListResolver } from './../../resolvers/company-list.resolver';
import { UpdateBranchComponent } from './update-branch/update-branch.component';
import { BranchListComponent } from './branch-list/branch-list.component';
import { BranchesSettingComponent } from './branches-setting.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path:"",
    children:[
      {
        path:"",
        component:BranchesSettingComponent,
        children:[
          {
            path:"list",
            component:BranchListComponent,
            resolve: {
              companyList: CompanyListResolver
            }
          },
          {
            path:"update",
            component: UpdateBranchComponent,
            resolve: {
              companyList: CompanyListResolver
            }
          },
          {
            path:"update/:id",
            component: UpdateBranchComponent,
            resolve: {
              companyList: CompanyListResolver
            }
          },
          {
            path:"**",
            redirectTo:"list"
          },
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BranchesSettingRoutingModule { }
