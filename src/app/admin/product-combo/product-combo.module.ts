import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductComboRoutingModule } from './product-combo-routing.module';
import { ProductComboComponent } from './product-combo.component';
import { ProductComboListComponent } from './product-combo-list/product-combo-list.component';
import { ProductComboUpdateComponent } from './product-combo-update/product-combo-update.component';
import {SharedModule} from '../../shared/shared.module';


@NgModule({
  declarations: [
    ProductComboComponent,
    ProductComboListComponent,
    ProductComboUpdateComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ProductComboRoutingModule
  ]
})
export class ProductComboModule { }
