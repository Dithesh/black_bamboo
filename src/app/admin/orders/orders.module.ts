import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrdersRoutingModule } from './orders-routing.module';
import { OrdersComponent } from './orders.component';
import { NewOrderComponent } from './components/new-order/new-order.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { PrintOrderInvoiceComponent } from './components/print-order-invoice/print-order-invoice.component';
import { AddOrderItemComponent } from './components/add-order-item/add-order-item.component';
import { ServeOrderItemComponent } from './components/serve-order-item/serve-order-item.component';
import { TableSelectionComponent } from './components/table-selection/table-selection.component';
import { OrderListsComponent } from './components/order-lists/order-lists.component';
import { PrintKotComponent } from './components/print-kot/print-kot.component';
import { QuickOrderComponent } from './components/quick-order/quick-order.component';
import { QuickOrderUpdateComponent } from './components/quick-order/quick-order-update/quick-order-update.component';
import { OrderUpdateManagerComponent } from './components/quick-order/order-update-manager/order-update-manager.component';
import {MatListModule} from "@angular/material/list";
import {MatDividerModule} from "@angular/material/divider";


@NgModule({
  declarations: [OrdersComponent, NewOrderComponent, PrintOrderInvoiceComponent, AddOrderItemComponent, ServeOrderItemComponent, TableSelectionComponent, OrderListsComponent, PrintKotComponent, QuickOrderComponent, QuickOrderUpdateComponent, OrderUpdateManagerComponent],
  imports: [
    CommonModule,
    OrdersRoutingModule,
    SharedModule,
    MatListModule,
    MatDividerModule
  ],
  entryComponents: [
    AddOrderItemComponent,
    ServeOrderItemComponent,
    PrintKotComponent,
    QuickOrderUpdateComponent,
    OrderUpdateManagerComponent
  ]
})
export class OrdersModule { }
