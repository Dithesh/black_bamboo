import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-popup',
  templateUrl: './confirm-popup.component.html',
  styleUrls: ['./confirm-popup.component.scss']
})
export class ConfirmPopupComponent implements OnInit {
  message="Are you sure you want to delete this record?"
  constructor(private dialogRef: MatDialogRef<ConfirmPopupComponent>, @Inject(MAT_DIALOG_DATA) private data) { 
    console.log(data);
    if(data instanceof Object && data.hasOwnProperty('message')) {
      this.message = data.message;
    }
  }

  ngOnInit(): void {
  }
  closePopup(flag){
    this.dialogRef.close(flag);
  }
}
