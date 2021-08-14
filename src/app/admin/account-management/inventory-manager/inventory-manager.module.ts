import { SharedModule } from '../../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InventoryManagerRoutingModule } from './inventory-manager-routing.module';
import { UpdateInventoryManagerComponent } from './update-inventory-manager/update-inventory-manager.component';
import { InventoryDetailsComponent } from './inventory-details/inventory-details.component';
import { InventoryStockUpdateComponent } from './inventory-details/inventory-stock-update/inventory-stock-update.component';
import { InventoryListComponent } from './inventory-list/inventory-list.component';
import { InventoryDashboardComponent } from './inventory-dashboard/inventory-dashboard.component';


@NgModule({
  declarations: [UpdateInventoryManagerComponent, InventoryDetailsComponent, InventoryStockUpdateComponent, InventoryListComponent, InventoryDashboardComponent],
  imports: [
    CommonModule,
    InventoryManagerRoutingModule,
    SharedModule
  ],
  entryComponents:[InventoryStockUpdateComponent]
})
export class InventoryManagerModule { }
