import { InventoryDetailsComponent } from './inventory-details/inventory-details.component';
import { UpdateInventoryManagerComponent } from './update-inventory-manager/update-inventory-manager.component';
import { InventoryManagerComponent } from './inventory-manager.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {InventoryDashboardComponent} from './inventory-dashboard/inventory-dashboard.component';
import {InventoryListComponent} from './inventory-list/inventory-list.component';
import {CompanyListResolver} from '../../resolvers/company-list.resolver';


const routes: Routes = [
  {
    path: '',
    component: InventoryManagerComponent,
    resolve: {
      companyList: CompanyListResolver
    },
    children: [
      {
        path: 'dashboard',
        component: InventoryDashboardComponent
      },
      {
        path: 'list',
        component: InventoryListComponent
      },
      {
        path: 'list/view/:id',
        component: InventoryDetailsComponent
      },
      {
        path: 'update',
        component: UpdateInventoryManagerComponent
      },
      {
        path: 'update/:id',
        component: UpdateInventoryManagerComponent
      },
      {
        path: '**',
        redirectTo: 'list'
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventoryManagerRoutingModule { }
