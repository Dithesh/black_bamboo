import { SharedModule } from './../../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NewTransactionRoutingModule } from './new-transaction-routing.module';
import { NewTransactionComponent } from './new-transaction.component';
import { NewPurchaseComponent } from './new-purchase/new-purchase.component';
import { NewSalesComponent } from './new-sales/new-sales.component';
import { NewPaymentComponent } from './new-payment/new-payment.component';
import { NewReceiptComponent } from './new-receipt/new-receipt.component';
import { NewTransactionService } from './new-transaction.service';


@NgModule({
  declarations: [NewTransactionComponent, NewPurchaseComponent, NewSalesComponent, NewPaymentComponent, NewReceiptComponent],
  imports: [
    CommonModule,
    NewTransactionRoutingModule,
    SharedModule
  ],
  providers: [
    NewTransactionService
  ]
})
export class NewTransactionModule { }
