import { CompanyListResolver } from './../resolvers/company-list.resolver';
import { UpdateUserComponent } from './update-user/update-user.component';
import { UserListComponent } from './user-list/user-list.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserComponent } from './user.component';
import { RoleGaurd } from 'src/app/shared/gaurd/role-gaurd';


const routes: Routes = [
  {
    path:"",
    component: UserComponent,
    children:[
      {
        path:"list",
        component: UserListComponent,
        data: {
          module: 'users',
          mode: 'read'
        },
        canActivate: [ RoleGaurd ]
      },
      {
        path:"update",
        component: UpdateUserComponent,
        resolve: {
          companyList: CompanyListResolver
        },
        data: {
          module: 'users',
          mode: 'full'
        },
        canActivate: [ RoleGaurd ]
      },
      {
        path:"update/:id",
        component: UpdateUserComponent,
        resolve: {
          companyList: CompanyListResolver
        },
        data: {
          module: 'users',
          mode: 'full'
        },
        canActivate: [ RoleGaurd ]
      },
      {
        path:"attendance",
        loadChildren: () => import('./attendance/attendance.module').then(m => m.AttendanceModule),
        resolve: {
          companyList: CompanyListResolver
        },
        data: {
          module: 'user-attendance',
          mode: 'read'
        },
        canActivate: [ RoleGaurd ]
      },
      {
        path: "**",
        redirectTo: "list"
      }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
