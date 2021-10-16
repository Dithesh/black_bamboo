import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {DataService} from "../../services/data.service";

@Component({
  selector: 'app-table-update',
  templateUrl: './table-update.component.html',
  styleUrls: ['./table-update.component.scss']
})
export class TableUpdateComponent implements OnInit {
  roomList: any[] = [];
  form = this.fb.group({
        id: [''],
        tableId: [''],
        room_id: [''],
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
    console.log(data.table)
    this.form.patchValue(data.table);
    this.getBranchDetails(data.table.branch_id);
  }

  ngOnInit(): void {
  }

  getBranchDetails(branchId) {
    this.serv.endpoint = 'order-manager/branch/' + branchId;
    this.serv.get().subscribe((data: any) => {
      this.roomList = data.rooms;
    });
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
