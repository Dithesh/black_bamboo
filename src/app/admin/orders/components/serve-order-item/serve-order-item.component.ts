import { Component, OnInit, Inject } from '@angular/core';
import { FormArray } from '@angular/forms';
import { DataService } from 'src/app/shared/services/data.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-serve-order-item',
  templateUrl: './serve-order-item.component.html',
  styleUrls: ['./serve-order-item.component.scss']
})
export class ServeOrderItemComponent implements OnInit {
  items: FormArray;
  url = environment.imgUrl;
  constructor(
    private _serv: DataService,
    @Inject(MAT_DIALOG_DATA) private data,
    private dialogRef: MatDialogRef<ServeOrderItemComponent>
  ) { 
    this.items = data.form;
  }

  ngOnInit(): void {
  }

  handleNumberControl(formControl, type) {
    let value = formControl.get('servedItems').value;
    if(isNaN(value) || value == null || value == undefined || value == "")value=0;
    if(type == 'next' && value < parseInt(formControl.get('productionReadyQuantity').value)) {
      value++;
    }else if(type == 'prev' && value > 0) {
      value--;
    }
    formControl.get('servedItems').setValue(value, {emitEvent: true});
  }

  getpendingItems(item) {
    return  parseInt(item.get('productionReadyQuantity').value) - parseInt(item.get('servedItems').value)
  }

  closeItem() {
    this.dialogRef.close();
  }
}
