import { SharedModule } from './../../../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InventoryManagerRoutingModule } from './inventory-manager-routing.module';
import { UpdateInventoryManagerComponent } from './update-inventory-manager/update-inventory-manager.component';
import { InventoryDetailsComponent } from './inventory-details/inventory-details.component';
import { InventoryStockUpdateComponent } from './inventory-details/inventory-stock-update/inventory-stock-update.component';


@NgModule({
  declarations: [UpdateInventoryManagerComponent, InventoryDetailsComponent, InventoryStockUpdateComponent],
  imports: [
    CommonModule,
    InventoryManagerRoutingModule,
    SharedModule
  ],
  entryComponents:[InventoryStockUpdateComponent]
})
export class InventoryManagerModule { }
