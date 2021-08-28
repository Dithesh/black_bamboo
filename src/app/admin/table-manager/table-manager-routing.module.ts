import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TableManagerComponent } from './table-manager.component';
import {TableListComponent} from './table-list/table-list.component';
import {CompanyListResolver} from "../resolvers/company-list.resolver";


const routes: Routes = [
  {
    path: '',
    component: TableManagerComponent,
    children: [
      {
        path: '',
        component: TableListComponent,
        resolve: {
          companyList: CompanyListResolver
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TableManagerRoutingModule { }
