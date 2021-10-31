import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-invoice-printing',
  templateUrl: './invoice-printing.component.html',
  styleUrls: ['./invoice-printing.component.scss']
})
export class InvoicePrintingComponent implements OnInit {
  @Input('orderData') orderData: any = null;
  @Input('branchData') branchData: any = null;
  ipc;

  constructor() {
    if ((<any> window).ipcRenderer) {
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
  }
  printPage(){
    if (this.ipc) {
      this.ipc.send('print_invoice', this.branchData.billPrinter);
    }else{
      window.print();
    }
  }

}
