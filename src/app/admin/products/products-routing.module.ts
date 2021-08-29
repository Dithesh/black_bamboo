import { CompanyListResolver } from './../resolvers/company-list.resolver';
import { ProductListComponent } from './product-list/product-list.component';
import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductsComponent } from './products.component';
import { AddProductComponent } from './components/add-product/add-product.component';
import { RoleGaurd } from 'src/app/shared/gaurd/role-gaurd';


const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: ProductsComponent,
        children: [
          {
            path: 'list',
            component: ProductListComponent,
            resolve: {
              companyList: CompanyListResolver
            },
            data: {
              module: 'products',
              mode: 'read'
            },
            canActivate: [ RoleGaurd ]
          },
          {
            path: 'update',
            component: AddProductComponent,
            resolve: {
              companyList: CompanyListResolver
            },
            data: {
              module: 'products',
              mode: 'c'
            },
            canActivate: [ RoleGaurd ]
          },
          {
            path: 'update/:id',
            component: AddProductComponent,
            resolve: {
              companyList: CompanyListResolver
            },
            data: {
              module: 'products',
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
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
