import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataService } from 'src/app/shared/services/data.service';

@Component({
  selector: 'app-update-attandance',
  templateUrl: './update-attandance.component.html',
  styleUrls: ['./update-attandance.component.scss']
})
export class UpdateAttandanceComponent implements OnInit {
  form: FormGroup;
  prevData=null;
  date=new Date();
  user;
  constructor(
    @Inject(MAT_DIALOG_DATA) private data,
    private _serv: DataService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<UpdateAttandanceComponent>
  ) { 
    this.prevData = data.previousData;
    this.date = data.date;
    this.user = data.user;
    this.form = this.fb.group({
      id: [(data.previousData)?data.previousData.id:''],
      user_id: [data.user.id],
      effectedDate: [data.date],
      isPresent: [(data.previousData)?data.previousData.isPresent:true],
      description: [(data.previousData)?data.previousData.description:'']
    })
  }

  ngOnInit(): void {
  }
  closeDilog(){
    this.dialogRef.close();
  }
  saveForm() {
    this._serv.endpoint="order-manager/user-attendance";
    this._serv.post(this.form.value).subscribe(response => {
      this._serv.showMessage('Attendance updated successfully.', 'success');
      this.dialogRef.close();
    }, (error) => {
      this._serv.handleError(error);
    })
  }

}
