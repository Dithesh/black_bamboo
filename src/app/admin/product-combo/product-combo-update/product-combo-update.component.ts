import {Component, OnInit, ViewChild} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {MatSort} from '@angular/material/sort';
import {DataService} from '../../../shared/services/data.service';
import {ActivatedRoute, Router} from '@angular/router';
import {debounceTime} from "rxjs/operators";
import * as math from 'exact-math';

@Component({
  selector: 'app-product-combo-update',
  templateUrl: './product-combo-update.component.html',
  styleUrls: ['./product-combo-update.component.scss']
})
export class ProductComboUpdateComponent implements OnInit {
  imageSrc = 'url(\'/assets/images/food.jpg\')';
  url = environment.imgUrl;
  form: FormGroup;
  productComboId: any;
  userData: any;
  companyList;
  branchList: any[];
  productList: any[] = [];
  advancedPriceList: any[] = [];

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  constructor(
    private serv: DataService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
    ) {
      this.productComboId = this.route.snapshot.params.id;

      this.form = this.fb.group({
        id: [''],
        comboTitle: [''],
        description: [''],
        featuredImage: [''],
        image: [''],
        comboTotal: [''],
        packagingCharges: [''],
        isActive: [true],
        canPriceAltered: [false],
        inclTax: [false],
        branch_id: [''],
        company_id: [''],
        items: this.fb.array([])
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
        this.getBranchProducts(this.userData.branch_id);
      }
    }

  ngOnInit(): void {
    if (this.productComboId) {
      this.getProductComboDetails();
    }
  }

  get items(){
    const form = this.form.get('items') as FormArray;
    return form;
  }

  handleItemValueChange(form) {
    console.log(form)
    form.valueChanges.pipe(
      debounceTime(1000)
    ).subscribe(response => {
      const quantity = this.serv.notNull(response.quantity) ? response.quantity : 0;
      const price = this.serv.notNull(response.price) ? response.price : 0;
      form.get('subTotal').setValue(math.mul(quantity, price), { emitEvent: false });
      this.handleTotalPriceCalculation();
    });
  }

  handleTotalPriceCalculation() {
    let total = 0;
    this.items.value.forEach(control => {
      if (!control.deletedFlag) {
        total = total + control.subTotal;
      }
    });
    this.form.get('comboTotal').setValue(total);
  }

  addItem(){
    return this.fb.group({
      id: [''],
      productId: [''],
      quantity: [''],
      price: [''],
      advancedPriceId: [''],
      subTotal: [''],
      variationList: [''],
      deletedFlag: [false]
    });
  }

  addAnotherItem() {
    const form = this.addItem();
    this.items.push(form);
    this.handleItemValueChange(form);
  }

  removeItem(item, index){
    if (this.serv.notNull(item.get('id').value)) {
      item.get('deletedFlag').setValue(true);
    }else {
      this.items.removeAt(index);
    }
    this.handleTotalPriceCalculation();
  }

  getProductComboDetails() {
    this.serv.endpoint = 'order-manager/product-combo/' + this.productComboId;
    this.serv.get().subscribe((data: any) => {
      this.form.patchValue(data);
      if (this.serv.notNull(data.featuredImage)){

        this.imageSrc = 'url(\'' + this.url + data.featuredImage + '\')';
      }
      this.getBranchProducts(data.branch_id, () => {
        this.items.controls = [];
        data.items.forEach((elem, index) => {
          const form = this.addItem();
          form.patchValue({
            ...elem,
            productId: elem.product_id
          });
          this.items.push(form);
          this.onProductSelect(index, form);
        });
      });

    });
  }

  onProductSelect(index, item) {
    this.items.controls.forEach((elem, i) => {
      if (index !== i) {
        if (!elem.get('deletedFlag').value && elem.get('productId').value === item.get('productId').value) {
          item.get('productId').setValue('', {emitEvent: false});
          item.get('variationList').setValue('', { emitEvent: false });
        }
      }
    });
    const productId = item.get('productId').value;
    if (this.serv.notNull(productId)) {
      const product = this.productList.filter(x => x.id === productId)[0];
      if (product.isAdvancedPricing) {
        item.get('variationList').setValue(product.advanced_pricing, { emitEvent: false });
      }else {
        item.get('variationList').setValue('', { emitEvent: false });
      }
    }
  }

  saveProductCombo(event) {
    if (event != null) {event.preventDefault(); }
    this.form.markAllAsTouched();
    if (this.form.invalid) {return; }
    const formValue = {...this.form.value};
    formValue.items.forEach(elem => {
      delete elem.variationList;
    });
    this.serv.endpoint = 'order-manager/product-combo';
    this.serv.post(formValue).subscribe(response => {
      this.serv.showMessage('Product combo updated successfully', 'success');
      this.router.navigateByUrl('/admin/product-combo');
    }, ({error}) => {
      this.serv.showMessage(error.msg, 'error');
    });
  }


  onCompanySelect(){
    this.form.get('branch_id').setValue('');
    this.getAllBranches();
  }

  getAllBranches() {
    this.clearAllItems();
    this.serv.endpoint = 'order-manager/branch?fields=id,branchTitle&companyId=' + this.form.get('company_id').value;
    this.serv.get().subscribe(response => {
      this.branchList = response as any[];
      if (this.productComboId === undefined && this.branchList.length > 0) {
        this.form.get('branch_id').setValue(this.branchList[0].id);
        this.getBranchProducts(this.branchList[0].id);
      }

      this.form.get('branch_id').valueChanges.subscribe(value => {
        this.getBranchProducts(value);
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
  clearAllItems() {
      this.items.controls.forEach((control, i) => {
        this.removeItem(control, i);
      });
  }

  getBranchProducts(branchId, callback = () => {}) {
    if (!this.serv.notNull(branchId)){
      this.productList = [];
      this.clearAllItems();
      return;
    }
    this.serv.endpoint = 'order-manager/product?fields=id,productName,isAdvancedPricing&branch_id=' + branchId;
    this.serv.get().subscribe((response: any) => {
      this.productList = response;
      callback();
    });
  }

}
