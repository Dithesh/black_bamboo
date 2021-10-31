import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmPopupComponent } from 'src/app/shared/components/confirm-popup/confirm-popup.component';
import { SnackService } from 'src/app/shared/services/snack.service';
import { FormGroup, FormBuilder, FormArray, AbstractControl, FormControl } from '@angular/forms';
import { DataService } from 'src/app/shared/services/data.service';
import { BehaviorSubject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {
  imageSrc = 'url(\'/assets/images/food.jpg\')';
  url = environment.imgUrl;
  form: FormGroup;
  branchList: any[];
  productId: any;
  categoryList: any[];
  kitchenList: any[];
  userData: any;
  companyList;

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  constructor(
    private serv: DataService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
    ) {
      this.productId = this.route.snapshot.params.id;

      this.form = this.fb.group({
        id: [''],
        productNumber: [''],
        productName: [''],
        description: [''],
        categories: [''],
        featuredImage: [''],
        image: [''],
        price: [''],
        isAdvancedPricing: [false],
        canPriceAltered: [false],
        pricingGroups: this.fb.array([this.addAdvancePrice()]),
        taxPercent: [''],
        packagingCharges: [''],
        isActive: [true],
        branch_id: [''],
        company_id: [''],
        isVeg: [false],
        isOutOfStock: [false],
        kitchen_id: [''],
      });
      this.userData = this.serv.getUserData();
      if (this.userData.roles === 'Super Admin') {
        this.route.data.subscribe(response => {
          this.companyList = response.companyList;
        });
      } else if (this.userData.roles === 'Company Admin') {
        this.form.patchValue({
          company_id: this.userData.company_id
        });
        this.getAllBranches();
      }else {
        this.form.patchValue({
          company_id: this.userData.company_id,
          branch_id: this.userData.branch_id
        });
        this.getBranchDetails(this.userData.branch_id);
        this.getAllCategories();
      }
    }

  ngOnInit(): void {
    if (this.productId) {
      this.getProductDetails();
    }
  }

  get pricingGroups(){
    return this.form.get('pricingGroups') as FormArray;
  }

  addAdvancePrice(){
    return this.fb.group({
      id: [''],
      title: [''],
      price: [''],
      deletedFlag: [false]
    });
  }

  addAnotherAdvancePrice() {
    this.pricingGroups.push(this.addAdvancePrice());
  }

  removeAdvancePrice(item, index){
    if (this.serv.notNull(item.get('id').value)) {
      item.get('deletedFlag').setValue(true);
    }else {
      this.pricingGroups.removeAt(index);
    }
  }

  getProductDetails() {
    this.serv.endpoint = 'order-manager/product/' + this.productId;
    this.serv.get().subscribe((data: any) => {
      data.categories = data.categories.map(x => x.id);
      this.form.patchValue(data);
      this.getBranchDetails(data.branch_id);
      this.getAllCategories();

      if (this.serv.notNull(data.featuredImage)){

        this.imageSrc = 'url(\'' + this.url + data.featuredImage + '\')';
      }
      this.pricingGroups.controls = [];
      data.advanced_pricing.forEach(elem => {
        const form = this.addAdvancePrice();
        form.patchValue(elem);
        this.pricingGroups.push(form);
      });
      // data.tables.forEach(elem => {
      //   this.tables.push(this.addTable(elem));
      //   this.dataSource.next(this.tables.controls);
      // })
    });
  }

  saveProduct($event) {
    if (event != null) {event.preventDefault(); }
    this.form.markAllAsTouched();
    if (this.form.invalid) {return; }
    const formValue = this.form.value;
    this.serv.endpoint = 'order-manager/product';
    this.serv.post(formValue).subscribe(response => {
      this.serv.showMessage('Product updated successfully', 'success');
      this.router.navigateByUrl('/admin/products');
    }, ({error}) => {
      this.serv.showMessage(error.msg, 'error');
    });
  }

  getAllCategories() {
    this.serv.endpoint = 'order-manager/category';
    this.serv.getByParam({
      fields: 'categories.id,categoryName',
      branchId: this.form.get('branch_id').value
    }).subscribe(response => {
      this.categoryList = response as any[];
    });
  }

  selectChange(type){
    this.form.get('categories').setValue('');
    this.form.get('kitchen_id').setValue('');
    if (type === 'company'){
      this.form.get('branch_id').setValue('');
      this.getAllBranches();
    }else {
      this.getAllCategories();
    }
  }

  getAllBranches() {
    this.serv.endpoint = 'order-manager/branch?fields=id,branchTitle&companyId=' + this.form.get('company_id').value;
    this.serv.get().subscribe(response => {
      this.branchList = response as any[];
      if (this.productId === undefined && this.branchList.length > 0) {
        this.form.get('branch_id').setValue(this.branchList[0].id);
        this.getBranchDetails(this.branchList[0].id);
        this.getAllCategories();
      }

      this.form.get('branch_id').valueChanges.subscribe(value => {
        this.form.get('kitchen_id').setValue('');
        this.getBranchDetails(value);
      });
    });
  }


  handleFileInput(event) {
    const file = event.dataTransfer ? event.dataTransfer.files[0] : event.target.files[0];
    const pattern = /image-*/;
    const reader = new FileReader();
    if (!file.type.match(pattern)) {
      alert('invalid format');
      return;
    }
    reader.onload = this._handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);
  }

  _handleReaderLoaded(file) {
    const reader = file.target;
    const imageSrc = reader.result;
    this.form.get('image').setValue(imageSrc);
    this.imageSrc = 'url(\' ' + imageSrc + '\')';
  }

  getBranchDetails(branchId) {
    if (!this.serv.notNull(branchId)){
      this.kitchenList = [];
      return;
    }
    this.serv.endpoint = 'order-manager/branch/' + branchId;
    this.serv.get().subscribe((response: any) => {
      this.kitchenList = response.kitchens as any[];
    });
  }

}
