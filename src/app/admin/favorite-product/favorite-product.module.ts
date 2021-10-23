import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FavoriteProductRoutingModule } from './favorite-product-routing.module';
import { FavoriteProductComponent } from './favorite-product.component';
import {FavoriteProductListComponent} from "./favorite-product-list/favorite-product-list.component";
import {FavoriteProductUpdateComponent} from "./favorite-product-update/favorite-product-update.component";
import {SharedModule} from "../../shared/shared.module";


@NgModule({
  declarations: [
    FavoriteProductComponent, FavoriteProductListComponent, FavoriteProductUpdateComponent
  ],
  imports: [
    CommonModule,
    FavoriteProductRoutingModule,
    SharedModule
  ]
})
export class FavoriteProductModule { }
