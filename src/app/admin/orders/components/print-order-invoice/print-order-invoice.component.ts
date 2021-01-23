import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-print-order-invoice',
  templateUrl: './print-order-invoice.component.html',
  styleUrls: ['./print-order-invoice.component.scss']
})
export class PrintOrderInvoiceComponent implements OnInit {
  orderData;
  branchData;
  companyData;
  userData;
  savedOrderData;
  constructor(
    @Inject(MAT_DIALOG_DATA) private data,
    private ref: MatDialogRef<PrintOrderInvoiceComponent>
  ) { 
    this.orderData = data.orderData;
    this.branchData = data.branchData;
    this.companyData = data.companyData;
    this.userData = data.userData;
    this.savedOrderData = data.savedOrderData;
    console.log(this.orderData, 'data order');
    
    
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
