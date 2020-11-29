import { CompanyListResolver } from './../resolvers/company-list.resolver';
import { UpdateUserComponent } from './update-user/update-user.component';
import { UserListComponent } from './user-list/user-list.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserComponent } from './user.component';


const routes: Routes = [
  {
    path:"",
    component: UserComponent,
    children:[
      {
        path:"list",
        component: UserListComponent
      },
      {
        path:"update",
        component: UpdateUserComponent,
        resolve: {
          companyList: CompanyListResolver
        }
      },
      {
        path:"update/:id",
        component: UpdateUserComponent,
        resolve: {
          companyList: CompanyListResolver
        }
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
