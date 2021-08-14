import { ConfirmPopupComponent } from '../../../../../shared/components/confirm-popup/confirm-popup.component';
import { MatDialogRef,MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataService } from 'src/app/shared/services/data.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-inventory-stock-update',
  templateUrl: './inventory-stock-update.component.html',
  styleUrls: ['./inventory-stock-update.component.scss']
})
export class InventoryStockUpdateComponent implements OnInit {
  form: FormGroup;
  constructor(
    private fb: FormBuilder,
    private _serv: DataService,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<InventoryStockUpdateComponent>,
    @Inject(MAT_DIALOG_DATA) private data:any
  ) {
    this.form = this.fb.group({
      managerId: [''],
      inventoryId:[''],
      transactionType:[''],
      quantity:[''],
      description:[''],
    })
    if(data.id){
      this.form.get('inventoryId').setValue(data.id);
      this.form.get('managerId').setValue(data.managerId);
    }
  }

  ngOnInit(): void {
  }
  closeDilog(){
    this.dialogRef.close();
  }
  confirmUpdate(event=null){
    if(event!=null)event.preventDefault();
    this.form.markAllAsTouched();
    if(this.form.invalid)return;
    let dialogRef = this.dialog.open(ConfirmPopupComponent,{
      data:{
        message:"Are you sure you want to update the Stock? It can't be reverted."
      }
    });
    dialogRef.afterClosed().subscribe(data => {
      if(data){
        this.updateStock()
      }
    })
  }
  updateStock() {
    // this.savingUpdate=true;
    let formValue = this.form.value;
    this._serv.endpoint="account-manager/inventory/stock-update";
    this._serv.post(formValue).subscribe((response:any) => {
      // this.savingUpdate=false;
      let message ='updated successfully';
      this._serv.showMessage(message, 'success');
      this.dialogRef.close();
    }, ({error}) => {
      if(error.hasOwnProperty('msg')) {
        this._serv.showMessage(error.msg, 'error');
      }else {
        this._serv.showMessage('Something went wrong. Please contact administator', 'error');
      }
    })
  }
}
