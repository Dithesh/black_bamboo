import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TransactionComponent } from './transaction.component';
import { PurchaseTransactionComponent } from './purchase-transaction/purchase-transaction.component';
import { PurchaseTransactionHistoryComponent } from './purchase-transaction-history/purchase-transaction-history.component';
import { SalesTransactionComponent } from './sales-transaction/sales-transaction.component';
import { SalesTransactionHistoryComponent } from './sales-transaction-history/sales-transaction-history.component';
import { PaymentTransactionComponent } from './payment-transaction/payment-transaction.component';
import { PaymentTransactionHistoryComponent } from './payment-transaction-history/payment-transaction-history.component';
import { ReceiptTransactionComponent } from './receipt-transaction/receipt-transaction.component';
import { ReceiptTransactionHistoryComponent } from './receipt-transaction-history/receipt-transaction-history.component';



const routes: Routes = [
  {
    path: "",
    component: TransactionComponent,
    children: [
      {
        path: "purchase-transaction",
        component: PurchaseTransactionComponent
      },
      {
        path: "purchase-transaction/:id",
        component: PurchaseTransactionComponent
      },
      {
        path: "purchase-transaction-history",
        component: PurchaseTransactionHistoryComponent
      },
      {
        path: "sales-transaction",
        component: SalesTransactionComponent
      },
      {
        path: "sales-transaction/:id",
        component: SalesTransactionComponent
      },
      {
        path: "sales-transaction-history",
        component: SalesTransactionHistoryComponent
      },
      {
        path: "payment-transaction",
        component: PaymentTransactionComponent
      },
      {
        path: "payment-transaction/:id",
        component: PaymentTransactionComponent
      },
      {
        path: "payment-transaction-history",
        component: PaymentTransactionHistoryComponent
      },
      {
        path: "receipt-transaction",
        component: ReceiptTransactionComponent
      },
      {
        path: "receipt-transaction/:id",
        component: ReceiptTransactionComponent
      },
      {
        path: "receipt-transaction-history",
        component: ReceiptTransactionHistoryComponent
      },
      {
        path: "**",
        pathMatch: 'full',
        redirectTo: "purchase-transaction"
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransactionRoutingModule { }
