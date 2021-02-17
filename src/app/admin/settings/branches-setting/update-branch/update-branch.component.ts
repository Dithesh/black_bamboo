import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
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
  url = environment.imgUrl;
  branchId;
  userData;
  companyList: any[] = [];
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
      gstNumber: [''],
      isActive: [false],
      taxPercent: [''],
      company_id:[''],
      kitchens: this.fb.array([]),
      orderTypes: this.fb.array([]),
      paymentMethods: this.fb.array([]),
    })
    this.route.data.subscribe(response => {
      this.companyList = response.companyList;
      if(this.companyList.length > 0)
        this.form.get('company_id').setValue(this.companyList[0].id)
    })
  }

  ngOnInit(): void {
    this.userData = this._serv.getUserData();
    if(this.branchId) {
      this.getBranchDetails();
    }
  }

  get paymentMethods() {
    return this.form.get('paymentMethods') as FormArray;
  }

  addNewPaymentMethod() {
    return this.fb.group({
      id: [''],
      methodTitle: [''],
      deletedFlag: [false]
    })
  }

  addAnotherPaymentMethod() {
    this.paymentMethods.push(this.addNewPaymentMethod());
  }

  deletePaymentMethod(item, index) {
    if(this._serv.notNull(item.get('id').value)) {
      item.get('deletedFlag').setValue(true);
    }else {
      this.paymentMethods.removeAt(index);
    }
  }

  get kitchens() {
    return this.form.get('kitchens') as FormArray;
  }

  addNewKitchen() {
    return this.fb.group({
      id: [''],
      kitchenTitle: [''],
      deletedFlag: [false]
    })
  }

  addAnotherKitchen() {
    this.kitchens.push(this.addNewKitchen());
  }

  deleteKitchen(item, index) {
    if(this._serv.notNull(item.get('id').value)) {
      item.get('deletedFlag').setValue(true);
    }else {
      this.kitchens.removeAt(index);
    }
  }

  get orderTypes() {
    return this.form.get('orderTypes') as FormArray;
  }

  addOrderType() {
    return this.fb.group({
      id: [''],
      orderType: [''],
      tableRequired: [false],
      isActive: [true],
      deletedFlag: [false]
    })
  }

  addAnotherOrderType() {
    this.orderTypes.push(this.addOrderType());
  }

  deleteOrderType(item, index) {
    if(this._serv.notNull(item.get('id').value)) {
      item.get('deletedFlag').setValue(true);
    }else {
      this.orderTypes.removeAt(index);
    }
  }

  getBranchDetails() {
    this._serv.endpoint = "order-manager/branch/"+this.branchId;
    this._serv.get().subscribe((data:any) => {
      this.form.patchValue(data);
      
      if(this._serv.notNull(data.branchLogo)){
        this.imageSrc = "url(\'"+ this.url + data.branchLogo +"\')"
      }

      data.kitchens.forEach(elem => {
        let form = this.addNewKitchen();
        form.patchValue(elem);
        this.kitchens.push(form);
      })
      data.order_types.forEach(elem => {
        let form = this.addOrderType();
        form.patchValue(elem);
        this.orderTypes.push(form);
      })
      data.payment_methods.forEach(elem => {
        let form = this.addNewPaymentMethod();
        form.patchValue(elem);
        this.paymentMethods.push(form);
      })
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
    this._serv.post(formValue).subscribe(response => {
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
