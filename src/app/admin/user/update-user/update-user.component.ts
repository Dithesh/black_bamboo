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
  processingAction=false;
  form:FormGroup;
  companyList: any[] = [];
  userId;
  loginUserDetail;
  branchList: any[];
  userRoles = [
    'Super Admin',
    'Company Admin',
    'Branch Admin',
    'Branch Manager',
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
      isActive: [true],
      attendaceRequired: [false]
    })

    this.loginUserDetail = this._serv.getUserData();
    if (this.loginUserDetail.roles === 'Super Admin') {
      this.route.data.subscribe(response => {
        this.companyList = response.companyList;
      })
    } else if (this.loginUserDetail.roles === 'Company Admin') {
      this.form.patchValue({
        company_id: this.loginUserDetail.company_id
      });
      this.getAllBranches();
    }else {
      this.form.patchValue({
        company_id: this.loginUserDetail.company_id,
        branch_id: this.loginUserDetail.branch_id
      });
    }
    if (this.loginUserDetail.roles !== 'Super Admin'){
      this.userRoles = this.userRoles.splice(this.userRoles.indexOf(this.loginUserDetail.roles)+1, this.userRoles.length);
    }
  }

  ngOnInit(): void {
    if(this.userId) {
      this.getUserDetails();
    }
  }

  ngAfterViewInit() {

  }

  getUserDetails(){
    this._serv.endpoint = "order-manager/user/"+this.userId;
    this._serv.get().subscribe((data:any) => {
      this.form.patchValue({...data, password: ""});

      if(this._serv.notNull(data.profilePic)){
        this.imageSrc = "url(\'"+ this.url + data.profilePic +"\')"
      }
      if(this._serv.notNull(this.form.get('company_id').value)) {
        this.getAllBranches()
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
    if(this.processingAction) return

    if(event!=null)event.preventDefault();
    this.form.markAllAsTouched();
    console.log(this.form);
    if(this.form.invalid)return;
    this.processingAction = true;
    let formValue = this.form.value;
    // console.log(formValue);
    this._serv.endpoint="order-manager/user";
    this._serv.post(formValue).subscribe(response => {
      this._serv.showMessage("User updated successfully", 'success')
      this.router.navigateByUrl('/admin/user/list')
      this.processingAction = false;
    }, ({error}) => {
      this._serv.showMessage(error['msg'], 'error');
      this.processingAction = false;
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
