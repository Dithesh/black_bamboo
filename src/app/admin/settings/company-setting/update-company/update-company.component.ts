import { DataService } from 'src/app/shared/services/data.service';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-update-company',
  templateUrl: './update-company.component.html',
  styleUrls: ['./update-company.component.scss']
})
export class UpdateCompanyComponent implements OnInit {

  imageSrc="url(\'/assets/images/food.jpg\')";
  url = environment.imgUrl;
  companyId;
  userData;
  form:FormGroup;
  constructor(
    private _serv: DataService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router)
     {
      this.companyId = this.route.snapshot.params.id;
      this.form = this.fb.group({
      id: [''],
      image: [''],
      companyName: [''],
      companyDetails: [''],
      numberOfBranchesAllowed: [''],
      enableAccounting: [false],
      enableRestaurantFunctions:[false],
      isActive: [true],
    })
    
  }

  ngOnInit(): void {
    if(this.companyId) {
      this.getCompanyDetails();
    }
  }
  getCompanyDetails(){
      this._serv.endpoint = "order-manager/company/"+this.companyId;
      this._serv.get().subscribe((data:any) => {
        this.form.patchValue(data);
        
        if(this._serv.notNull(data.companyLogo)){
          this.imageSrc = "url(\'"+ this.url + data.companyLogo +"\')"
        }
      })
  }
  saveCompany(event=null) {
    if(event!=null)event.preventDefault();
    this.form.markAllAsTouched();
    if(this.form.invalid)return;
    let formValue = this.form.value;
    this._serv.endpoint="order-manager/company";
    this._serv.post(formValue).subscribe(response => {
      this._serv.showMessage("Company updated successfully", 'success')
      this.router.navigateByUrl('/admin/settings/company/list')
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
