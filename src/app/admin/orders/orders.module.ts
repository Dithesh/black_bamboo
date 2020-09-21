import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrdersRoutingModule } from './orders-routing.module';
import { OrdersComponent } from './orders.component';
import { NewOrderComponent } from './components/new-order/new-order.component';
import { SharedModule } from 'src/app/shared/shared.module';
import {NgxPrintModule} from 'ngx-print';
import { PrintOrderInvoiceComponent } from './components/print-order-invoice/print-order-invoice.component';
import { AddOrderItemComponent } from './components/add-order-item/add-order-item.component';
import { ServeOrderItemComponent } from './components/serve-order-item/serve-order-item.component';
import { TableSelectionComponent } from './components/table-selection/table-selection.component';


@NgModule({
  declarations: [OrdersComponent, NewOrderComponent, PrintOrderInvoiceComponent, AddOrderItemComponent, ServeOrderItemComponent, TableSelectionComponent],
  imports: [
    CommonModule,
    OrdersRoutingModule,
    SharedModule,
    NgxPrintModule
  ],
  entryComponents: [
    AddOrderItemComponent,
    ServeOrderItemComponent,
    TableSelectionComponent
  ]
})
export class OrdersModule { }
