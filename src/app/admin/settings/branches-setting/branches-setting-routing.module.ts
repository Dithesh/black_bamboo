import { CompanyListResolver } from './../../resolvers/company-list.resolver';
import { UpdateBranchComponent } from './update-branch/update-branch.component';
import { BranchListComponent } from './branch-list/branch-list.component';
import { BranchesSettingComponent } from './branches-setting.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoleGaurd } from './../../../shared/gaurd/role-gaurd';
import {TableSetupComponent} from "./table-setup/table-setup.component";
import {BranchTableListResolver} from "./table-setup/branch-table-list.resolver";


const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: BranchesSettingComponent,
        children: [
          {
            path: 'list',
            component: BranchListComponent,
            resolve: {
              companyList: CompanyListResolver
            },
            data: {
              module: 'branch',
              mode: 'read'
            },
            canActivate: [ RoleGaurd ]
          },
          {
            path: 'update',
            component: UpdateBranchComponent,
            resolve: {
              companyList: CompanyListResolver
            },
            data: {
              module: 'branch',
              mode: 'full'
            },
            canActivate: [ RoleGaurd ]
          },
          {
            path: 'update/tables/:id',
            component: TableSetupComponent,
            resolve: {
              tableList: BranchTableListResolver
            },
            // data: {
            //   module: 'branch-table-setup',
            //   mode: 'full'
            // },
            // canActivate: [ RoleGaurd ]
          },
          {
            path: 'update/:id',
            component: UpdateBranchComponent,
            resolve: {
              companyList: CompanyListResolver
            },
            data: {
              module: 'branch',
              mode: 'full'
            },
            canActivate: [ RoleGaurd ]
          },
          {
            path: '**',
            redirectTo: 'list'
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
