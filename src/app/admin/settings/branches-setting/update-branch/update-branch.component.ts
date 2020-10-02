import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/shared/services/data.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-update-branch',
  templateUrl: './update-branch.component.html',
  styleUrls: ['./update-branch.component.scss']
})
export class UpdateBranchComponent implements OnInit {
  imageSrc="url(\'/assets/images/food.jpg\')";
  url = environment.domain;
  branchId;
  userData;

  form:FormGroup;
  constructor(
    private _serv: DataService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router)
     {
      this.branchId = this.route.snapshot.params.id;
    this.form = this.fb.group({
      id: [''],
      image: [''],
      branchCode: [''],
      branchTitle: [''],
      description: [''],
      branchAddress: [''],
      isActive: [false]
    })
  }

  ngOnInit(): void {
    this.userData = this._serv.getUserData();
    if(this.branchId) {
      this.getBranchDetails();
    }
  }

  getBranchDetails() {
    this._serv.endpoint = "order-manager/branch/"+this.branchId;
    this._serv.get().subscribe((data:any) => {
      this.form.patchValue(data);
      
      if(this._serv.notNull(data.branchLogo)){
        
        this.imageSrc = "url(\'"+ this.url + data.branchLogo +"\')"
      }
      // data.tables.forEach(elem => {
      //   this.tables.push(this.addTable(elem));
      //   this.dataSource.next(this.tables.controls);
      // })
    })
  }


  saveBranch(event=null) {
    if(event!=null)event.preventDefault();
    this.form.markAllAsTouched();
    if(this.form.invalid)return;
    let formValue = this.form.value;
    this._serv.endpoint="order-manager/branch";
    let apiCall=null;
    if(formValue.id && formValue.id != null && formValue.id !=undefined){
      this._serv.endpoint+='/'+formValue.id;
      apiCall = this._serv.put(formValue);
    }else {
      apiCall = this._serv.post(formValue);
    }
    apiCall.subscribe(response => {
      this._serv.showMessage("Branch updated successfully", 'success')
      this.router.navigateByUrl('/admin/settings/branches')
    }, ({error}) => {
      this._serv.showMessage(error['msg'], 'error');
    })
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
}
