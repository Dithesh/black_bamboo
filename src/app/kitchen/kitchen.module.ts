import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { KitchenRoutingModule } from './kitchen-routing.module';
import { KitchenComponent } from './kitchen.component';
import {SharedModule } from './../shared/shared.module';
import { KitchenHeaderComponent } from './layout/kitchen-header/kitchen-header.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDividerModule } from '@angular/material/divider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { KitchenTokenInterceptor } from '../shared/services/intercepter';


@NgModule({
  declarations: [KitchenComponent, KitchenHeaderComponent],
  imports: [
    CommonModule,
    KitchenRoutingModule,
    MatSidenavModule,
    MatDividerModule,
    MatToolbarModule,
    SharedModule
  ], 
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: KitchenTokenInterceptor,
      multi: true
    },
  ]
})
export class KitchenModule { }
