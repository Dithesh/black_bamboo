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
import { OrderUpdateManagerComponent } from './components/quick-order/order-update-manager/order-update-manager.component';
import {MatListModule} from "@angular/material/list";
import {MatDividerModule} from "@angular/material/divider";
import { OrderItemAddComponent } from './components/quick-order/order-update-manager/order-item-add/order-item-add.component';
import { OrderTableUpdateComponent } from './components/quick-order/order-update-manager/order-table-update/order-table-update.component';
import { InvoicePrintingComponent } from './components/quick-order/order-update-manager/invoice-printing/invoice-printing.component';
import { KotPrintingComponent } from './components/quick-order/order-update-manager/kot-printing/kot-printing.component';
import { CustomerInfoUpdateComponent } from './components/quick-order/order-update-manager/customer-info-update/customer-info-update.component';


@NgModule({
  declarations: [OrdersComponent, NewOrderComponent, PrintOrderInvoiceComponent, AddOrderItemComponent, ServeOrderItemComponent, TableSelectionComponent, OrderListsComponent, PrintKotComponent, QuickOrderComponent, OrderUpdateManagerComponent, OrderItemAddComponent, OrderTableUpdateComponent, InvoicePrintingComponent, KotPrintingComponent, CustomerInfoUpdateComponent],
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
    OrderUpdateManagerComponent,
    OrderItemAddComponent,
    OrderTableUpdateComponent,
    CustomerInfoUpdateComponent
  ]
})
export class OrdersModule { }
