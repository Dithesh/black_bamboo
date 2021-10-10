import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ProductComboComponent} from './product-combo.component';
import {ProductComboListComponent} from './product-combo-list/product-combo-list.component';
import {ProductComboUpdateComponent} from './product-combo-update/product-combo-update.component';
import {RoleGaurd} from '../../shared/gaurd/role-gaurd';
import {CompanyListResolver} from '../resolvers/company-list.resolver';

const routes: Routes = [
  {
      path: '',
      component: ProductComboComponent,
      children: [
        {
          path: 'list',
          component: ProductComboListComponent,
          resolve: {
            companyList: CompanyListResolver
          },
          data: {
            module: 'product-combo',
            mode: 'read'
          },
          canActivate: [ RoleGaurd ]
        },
        {
          path: 'update',
          component: ProductComboUpdateComponent,
          resolve: {
            companyList: CompanyListResolver
          },
          data: {
            module: 'product-combo',
            mode: 'full'
          },
          canActivate: [ RoleGaurd ]
        },
        {
          path: 'update/:id',
          component: ProductComboUpdateComponent,
          resolve: {
            companyList: CompanyListResolver
          },
          data: {
            module: 'product-combo',
            mode: 'full'
          },
          canActivate: [ RoleGaurd ]
        },
        {
          path: '**',
          redirectTo: 'list'
        }
      ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductComboRoutingModule { }
