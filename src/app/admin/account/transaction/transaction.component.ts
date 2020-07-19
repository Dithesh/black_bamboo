import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss']
})
export class TransactionComponent implements OnInit {

  sideMenu = [
    {
      key: "Purchase",
      link: "/admin/account/transaction/purchase-transaction"
    },
    {
      key: "Transaction History",
      link: "/admin/account/transaction/purchase-transaction-history"
    },
    {
      key: "Sales",
      link: "/admin/account/transaction/sales-transaction"
    },
    {
      key: "Sales History",
      link: "/admin/account/transaction/sales-transaction-history"
    },
    {
      key: "Payment",
      link: "/admin/account/transaction/payment-transaction"
    },
    {
      key: "Payment History",
      link: "/admin/account/transaction/payment-transaction-history"
    },
    {
      key: "Receipt",
      link: "/admin/account/transaction/receipt-transaction"
    },
    {
      key: "Receipt History",
      link: "/admin/account/transaction/receipt-transaction-history"
    },
  ]
  constructor() { }

  ngOnInit(): void {
  }

}
