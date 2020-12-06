import { CompanySettingComponent } from './company-setting.component';
import { ListCompanyComponent } from './list-company/list-company.component';
import { CompanyListResolver } from './../../resolvers/company-list.resolver';
import { UpdateCompanyComponent } from './update-company/update-company.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoleGaurd } from 'src/app/shared/gaurd/role-gaurd';


const routes: Routes = [
  {
    path: "",
    component: CompanySettingComponent,
    children: [
      {
        path: "list",
        component: ListCompanyComponent,
        data: {
          module: 'company',
          mode: 'read'
        },
        canActivate: [ RoleGaurd ]
      },
      {
        path:"update",
        component: UpdateCompanyComponent,
        data: {
          module: 'company',
          mode: 'full'
        },
        canActivate: [ RoleGaurd ]
      },
      {
        path:"update/:id",
        component: UpdateCompanyComponent,
        data: {
          module: 'company',
          mode: 'full'
        },
        canActivate: [ RoleGaurd ]
      },
      {
        path: "**",
        redirectTo: "list"
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanySettingRoutingModule { }
