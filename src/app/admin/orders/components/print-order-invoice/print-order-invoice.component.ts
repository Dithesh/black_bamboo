import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-print-order-invoice',
  templateUrl: './print-order-invoice.component.html',
  styleUrls: ['./print-order-invoice.component.scss']
})
export class PrintOrderInvoiceComponent implements OnInit {
  orderData;
  constructor(
    @Inject(MAT_DIALOG_DATA) private data
  ) { 
    this.orderData = data.orderData;
  }

  ngOnInit(): void {
  }

}
