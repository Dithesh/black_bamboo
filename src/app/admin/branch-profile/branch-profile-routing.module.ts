import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {BranchProfileComponent} from './branch-profile.component';
import {BasicProfileComponent} from './basic-profile/basic-profile.component';
import {RoleGaurd} from '../../shared/gaurd/role-gaurd';
import {AppConfigurationComponent} from './app-configuration/app-configuration.component';
import {AppGuideComponent} from './app-guide/app-guide.component';
import {BranchUserBranchDetailsResolver} from '../resolvers/branch-user-branch-details.resolver';

const routes: Routes = [
  {
    path: '',
    component: BranchProfileComponent,
    children: [
      {
        path: 'profile',
        component: BasicProfileComponent,
        resolve: {
          branchDetails: BranchUserBranchDetailsResolver
        },
        data: {
          module: 'branch-profile',
          mode: 'full'
        },
        canActivate: [ RoleGaurd ]
      },
      {
        path: 'configuration',
        component: AppConfigurationComponent,
        resolve: {
          branchDetails: BranchUserBranchDetailsResolver
        },
        data: {
          module: 'branch-profile',
          mode: 'full'
        },
        canActivate: [ RoleGaurd ]
      },
      {
        path: 'guide',
        component: AppGuideComponent,
        data: {
          module: 'branch-profile',
          mode: 'full'
        },
        canActivate: [ RoleGaurd ]
      },
      {
        path: '**',
        redirectTo: 'profile'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BranchProfileRoutingModule { }
