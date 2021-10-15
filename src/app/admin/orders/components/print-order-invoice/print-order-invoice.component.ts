import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IpcRenderer } from 'electron';


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
  ipc;
  constructor(
    @Inject(MAT_DIALOG_DATA) private data,
    private ref: MatDialogRef<PrintOrderInvoiceComponent>
  ) {
    this.orderData = data.orderData;
    this.branchData = data.branchData;
    this.companyData = data.companyData;
    this.userData = data.userData;
    this.savedOrderData = data.savedOrderData;

    if ((<any>window).ipcRenderer) {
      try {
        this.ipc = (window as any).ipcRenderer;
      } catch (error) {
        // throw error;
      }
    } else {
      console.warn('Could not load electron ipc');
    }
  }

  ngOnInit(): void {
    setTimeout(() => {
      if (this.ipc) {
        this.ipc.send('print_invoice', this.branchData.billPrinter);
      }else {
        window.print();
      }

    }, 500);
  }

  printPage(){
    if (this.ipc) {
      this.ipc.send('print_invoice', this.branchData.billPrinter);
    }else{
      window.print();
    }
  }
  cancelPrint(){
    this.ref.close();
  }
}
