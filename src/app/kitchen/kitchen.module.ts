import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { KitchenRoutingModule } from './kitchen-routing.module';
import { KitchenComponent } from './kitchen.component';
import {SharedModule } from './../shared/shared.module';


@NgModule({
  declarations: [KitchenComponent],
  imports: [
    CommonModule,
    KitchenRoutingModule,
    SharedModule
  ]
})
export class KitchenModule { }
