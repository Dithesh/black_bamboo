import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {DataService} from "../../../../../shared/services/data.service";

@Component({
  selector: 'app-table-update',
  templateUrl: './table-update.component.html',
  styleUrls: ['./table-update.component.scss']
})
export class TableUpdateComponent implements OnInit {
  form = this.fb.group({
        id: [''],
        tableId: [''],
        noOfChair: [''],
        description: [''],
        isReserved: [false],
        isActive: [true],
        branch_id: ['']
  });
  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private data,
    private dialogRef: MatDialogRef<TableUpdateComponent>,
    private serv: DataService
  ) {
    this.form.patchValue(data.table);
  }

  ngOnInit(): void {
  }

  updateTable(event) {
    if (event != null) {event.preventDefault(); }
    this.form.markAllAsTouched();
    if (this.form.invalid) {return; }
    const formValue = this.form.value;
    this.serv.endpoint = 'order-manager/table-manager/table';

    this.serv.post(formValue).subscribe(response => {
      this.serv.showMessage('Tables updated successfully', 'success');
      this.dialogRef.close();
    }, ({error}) => {
      this.serv.showMessage(error.msg, 'error');
    });
  }



  handelClickChairQty(type){
    let currentVal = this.form.get('noOfChair').value;
    if (type === 'next') {
      currentVal++;
      this.form.get('noOfChair').setValue(currentVal);
    }else if (type === 'prev' && currentVal >= 2) {
      currentVal--;
      this.form.get('noOfChair').setValue(currentVal);
    }

  }

}
