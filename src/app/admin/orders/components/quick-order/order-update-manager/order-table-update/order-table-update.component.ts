import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormArray} from '@angular/forms';

@Component({
  selector: 'app-order-table-update',
  templateUrl: './order-table-update.component.html',
  styleUrls: ['./order-table-update.component.scss']
})
export class OrderTableUpdateComponent implements OnInit {
  roomList: any = {};
  blockForms = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data,
    private dialogRef: MatDialogRef<OrderTableUpdateComponent>
  ) {
    this.blockForms = data.blockForms;
    this.data.tables.controls.forEach(control => {
      if (this.roomList[control.get('roomName').value]) {
        this.roomList[control.get('roomName').value].push(control);
      } else {
        this.roomList[control.get('roomName').value] = [control];
      }
    });
  }

  ngOnInit(): void {
  }


  selectAllChairs(table) {
    if (this.blockForms) {
      return;
    }
    (table.get('chairs') as FormArray).controls.forEach(elem => {
      if (elem.get('permission').value === 'full') {
        elem.get('isSelected').setValue(true);
      }
    });
  }

  saveData() {
    this.dialogRef.close(true);
  }

  resetForm() {
    this.data.tables.controls.forEach(table => {
      (table.get('chairs') as FormArray).controls.forEach(elem => {
        if (elem.get('permission').value === 'full') {
          elem.get('isSelected').setValue(false);
        }
      });
    });
    this.dialogRef.close();
  }

}
