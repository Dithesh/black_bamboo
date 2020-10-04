import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { KitchenDashboardRoutingModule } from './kitchen-dashboard-routing.module';
import { KitchenDashboardComponent } from './kitchen-dashboard.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [KitchenDashboardComponent],
  imports: [
    CommonModule,
    KitchenDashboardRoutingModule,
    SharedModule
  ]
})
export class KitchenDashboardModule { }
