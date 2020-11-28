import { CompanySettingComponent } from './company-setting.component';
import { ListCompanyComponent } from './list-company/list-company.component';
import { CompanyListResolver } from './../../resolvers/company-list.resolver';
import { UpdateCompanyComponent } from './update-company/update-company.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path: "",
    component: CompanySettingComponent,
    children: [
      {
        path: "list",
        component: ListCompanyComponent
      },
      {
        path:"update",
        component: UpdateCompanyComponent
      },
      {
        path:"update/:id",
        component: UpdateCompanyComponent
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
