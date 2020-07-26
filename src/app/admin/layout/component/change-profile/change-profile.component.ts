import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DataService } from 'src/app/shared/services/data.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-change-profile',
  templateUrl: './change-profile.component.html',
  styleUrls: ['./change-profile.component.scss']
})
export class ChangeProfileComponent implements OnInit {
  imageSrc="url(\'/assets/images/user.png\')";
  form: FormGroup;
  constructor(
    private fb: FormBuilder,
    private _serv: DataService,
    private dialogRef: MatDialogRef<ChangeProfileComponent>,
    @Inject(MAT_DIALOG_DATA) private data:any
  ) { 
    this.imageSrc = this.data.image;
    this.form = this.fb.group({
      image: ['', [Validators.required]]
    })
  }

  ngOnInit(): void {
  }

  handleFileInput(event) {
    var file = event.dataTransfer ? event.dataTransfer.files[0] : event.target.files[0];
    var pattern = /image-*/;
    var reader = new FileReader();
    if (!file.type.match(pattern)) {
      alert('invalid format');
      return;
    }
    reader.onload = this._handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);
  }

  _handleReaderLoaded(file) {
    let reader = file.target;
    let imageSrc = reader.result;
    this.form.get('image').setValue(imageSrc)
    this.imageSrc = "url(\'"+imageSrc+"\')";
  }

  saveImage(event) {
    event.preventDefault();
    this.form.markAllAsTouched();
    if(this.form.invalid)return;
    this._serv.endpoint = "order-manager/user/change-current-user-image";
    this._serv.post(this.form.value).subscribe(response => {
      this._serv.showMessage('Profile photo uploaded.', 'success');
      this.dialogRef.close();
    }, ({error}) => {
      this._serv.showMessage(error['msg'], 'error');
    })
  }
}
