import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

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
