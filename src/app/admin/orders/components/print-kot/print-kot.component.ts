import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IpcRenderer } from 'electron';

@Component({
  selector: 'app-print-kot',
  templateUrl: './print-kot.component.html',
  styleUrls: ['./print-kot.component.scss']
})
export class PrintKotComponent implements OnInit {
  orderData;
  branchData;
  companyData;
  userData;
  itemGroup={};
  savedOrderData;
  ipc;
  constructor(
    @Inject(MAT_DIALOG_DATA) private data,
    private ref: MatDialogRef<PrintKotComponent>
  ) {
    this.orderData = data.orderData;
    this.branchData = data.branchData;
    this.companyData = data.companyData;
    this.userData = data.userData;
    this.savedOrderData = data.savedOrderData;

    // if(data.orderData.items){
    //   this.orderData.items.forEach(item => {
    //     if(!this.itemGroup.hasOwnProperty(item.orderGroup)){
    //       this.itemGroup[item.orderGroup]=[];
    //     }
    //     this.itemGroup[item.orderGroup].push(item)

    //   });
    // }
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
    setTimeout(() =>{
      if (this.ipc) {
        this.ipc.send('print_invoice', this.branchData.kotPrinter);
      }else {
        window.print();
      }
    }, 500)
  }

  printPage(){
      if (this.ipc) {
        this.ipc.send('print_invoice', this.branchData.kotPrinter);
      }else {
        window.print();
      }
  }
  cancelPrint(){
    this.ref.close();
  }
}
