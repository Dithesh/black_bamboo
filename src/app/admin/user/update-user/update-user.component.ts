import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DataService } from 'src/app/shared/services/data.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.scss']
})
export class UpdateUserComponent implements OnInit {
  imageSrc="url(\'/assets/images/user.png\')";
  url = environment.imgUrl;
  dataSource;
  sidemenu=false;
  hide = true;
  form:FormGroup;
  companyList: any[] = [];
  userId;
  loginUserDetail;
  branchList: any[];
  userRoles = [
    'Super Admin',
    'Company Admin',
    'Company Accountant',
    'Branch Admin',
    'Branch Accountant',
    'Branch Order Manager',
    'Kitchen Manager',
    'Bearer'
  ]
  constructor(
    private _serv: DataService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router
  ) { 
    this.userId = this.route.snapshot.params.id;
    this.form = this.fb.group({
      id: [''],
      image:[''],
      firstName: [''],
      lastName: [''],
      roles: [''],
      company_id:[''],
      email: ['', RxwebValidators.email()],
      mobileNumber: [''],
      password: ['', RxwebValidators.password({validation:{minLength: 8, upperCase:true, lowerCase:true} })],
      branch_id: [''],
      isActive: [false]
    })
    this.route.data.subscribe(response => {
      this.companyList = response.companyList;
    })
  }

  ngOnInit(): void {
    if(this.userId) {
      this.getUserDetails();
    }
    this.loginUserDetail = this._serv.getUserData()
    this.userRoles = this.userRoles.splice(this.userRoles.indexOf(this.loginUserDetail.roles)+1, this.userRoles.length);
  }

  ngAfterViewInit() {
  
  }

  getUserDetails(){
    this._serv.endpoint = "order-manager/user/"+this.userId;
    this._serv.get().subscribe((data:any) => {
      this.form.patchValue(data);
      
      if(this._serv.notNull(data.profilePic)){
        this.imageSrc = "url(\'"+ this.url + data.profilePic +"\')"
      }
    })
}

  getAllBranches() {
    this._serv.endpoint = "order-manager/branch?fields=id,branchTitle&companyId="+this.form.get('company_id').value;
    this._serv.get().subscribe(response => {
      this.branchList = response as any[];
    })
  }


  updateUser(item = null) {
    if(item == null) {
      this.form.reset();
    }else {
      this.form.patchValue(item);
    }
    this.sidemenu = true;
  }

  cancelUpdate() {
    this.form.reset();
  }

  saveUser(event=null) {
    if(event!=null)event.preventDefault();
    this.form.markAllAsTouched();
    if(this.form.invalid)return;
    let formValue = this.form.value;
    this._serv.endpoint="order-manager/user";
    this._serv.post(formValue).subscribe(response => {
      this._serv.showMessage("User updated successfully", 'success')
      this.router.navigateByUrl('/admin/user/list')
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