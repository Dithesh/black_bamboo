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
  constructor(
    @Inject(MAT_DIALOG_DATA) private data,
    private ref: MatDialogRef<PrintOrderInvoiceComponent>
  ) { 
    this.orderData = data.orderData;
    this.branchData = data.branchData;
    this.companyData = data.companyData;
    this.userData = data.userData;
    console.log(this.orderData, 'data order');
    console.log(this.branchData, ' data branch');
    console.log(this.companyData,'companty data');
    console.log(this.userData,'data')
    
    
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
