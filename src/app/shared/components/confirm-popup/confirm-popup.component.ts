import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-popup',
  templateUrl: './confirm-popup.component.html',
  styleUrls: ['./confirm-popup.component.scss']
})
export class ConfirmPopupComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<ConfirmPopupComponent>) { }

  ngOnInit(): void {
  }
  closePopup(flag){
    this.dialogRef.close(flag);
  }
}
