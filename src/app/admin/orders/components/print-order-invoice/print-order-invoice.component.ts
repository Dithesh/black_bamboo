import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-print-order-invoice',
  templateUrl: './print-order-invoice.component.html',
  styleUrls: ['./print-order-invoice.component.scss']
})
export class PrintOrderInvoiceComponent implements OnInit {
  orderData;
  constructor(
    @Inject(MAT_DIALOG_DATA) private data,
    private ref: MatDialogRef<PrintOrderInvoiceComponent>
  ) { 
    this.orderData = data.orderData;
  }

  ngOnInit(): void {
    setTimeout(() =>{
      window.print();}, 1500)
  }

  printPage(){
    window.print();
  }
}
