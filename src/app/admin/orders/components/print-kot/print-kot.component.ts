import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-print-kot',
  templateUrl: './print-kot.component.html',
  styleUrls: ['./print-kot.component.scss']
})
export class PrintKotComponent implements OnInit {
  orderData;
  constructor(
    @Inject(MAT_DIALOG_DATA) private data,
    private ref: MatDialogRef<PrintKotComponent>
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
