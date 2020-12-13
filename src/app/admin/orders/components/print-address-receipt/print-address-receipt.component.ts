import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-print-address-receipt',
  templateUrl: './print-address-receipt.component.html',
  styleUrls: ['./print-address-receipt.component.scss']
})
export class PrintAddressReceiptComponent implements OnInit {
  orderData;
  constructor(
    @Inject(MAT_DIALOG_DATA) private data,
    private ref: MatDialogRef<PrintAddressReceiptComponent>
  ) { 
    this.orderData = data.orderData;
  }

  ngOnInit(): void {
    setTimeout(() =>{
      window.print();}, 500)
  }

  printPage(){
    window.print();
  }
  cancelPrint(){
    this.ref.close();
  }
}
