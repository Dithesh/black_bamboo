import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {CompanyListResolver} from "../resolvers/company-list.resolver";
import {RoleGaurd} from "../../shared/gaurd/role-gaurd";
import {FavoriteProductComponent} from "./favorite-product.component";
import {FavoriteProductListComponent} from "./favorite-product-list/favorite-product-list.component";
import {FavoriteProductUpdateComponent} from "./favorite-product-update/favorite-product-update.component";
const routes: Routes = [
  {
      path: '',
      component: FavoriteProductComponent,
      children: [
        {
          path: 'list',
          component: FavoriteProductListComponent,
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
          component: FavoriteProductUpdateComponent,
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
          component: FavoriteProductUpdateComponent,
          resolve: {
            companyList: CompanyListResolver
          },
          data: {
            module: 'favorite-menu',
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
export class FavoriteProductRoutingModule { }
