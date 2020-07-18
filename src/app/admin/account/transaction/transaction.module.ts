import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TransactionRoutingModule } from './transaction-routing.module';
import { TransactionComponent } from './transaction.component';
import { PurchaseTransactionComponent } from './purchase-transaction/purchase-transaction.component';
import { SalesTransactionComponent } from './sales-transaction/sales-transaction.component';
import { PaymentTransactionComponent } from './payment-transaction/payment-transaction.component';
import { ReceiptTransactionComponent } from './receipt-transaction/receipt-transaction.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AcSharedModule } from '../ac-shared/ac-shared.module';
import { PurchaseTransactionHistoryComponent } from './purchase-transaction-history/purchase-transaction-history.component';
import { SalesTransactionHistoryComponent } from './sales-transaction-history/sales-transaction-history.component';
import { PaymentTransactionHistoryComponent } from './payment-transaction-history/payment-transaction-history.component';
import { ReceiptTransactionHistoryComponent } from './receipt-transaction-history/receipt-transaction-history.component';


@NgModule({
  declarations: [TransactionComponent, PurchaseTransactionComponent, SalesTransactionComponent, PaymentTransactionComponent, ReceiptTransactionComponent, PurchaseTransactionHistoryComponent, SalesTransactionHistoryComponent, PaymentTransactionHistoryComponent, ReceiptTransactionHistoryComponent],
  imports: [
    CommonModule,
    TransactionRoutingModule,
    SharedModule,
    AcSharedModule
  ]
})
export class TransactionModule { }
