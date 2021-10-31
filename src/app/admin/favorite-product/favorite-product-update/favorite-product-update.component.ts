import {Component, OnInit, ViewChild} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {MatSort} from '@angular/material/sort';
import {DataService} from '../../../shared/services/data.service';
import {ActivatedRoute, Router} from '@angular/router';
import {debounceTime} from 'rxjs/operators';
import {RxwebValidators} from "@rxweb/reactive-form-validators";

@Component({
  selector: 'app-favorite-product-update',
  templateUrl: './favorite-product-update.component.html',
  styleUrls: ['./favorite-product-update.component.scss']
})
export class FavoriteProductUpdateComponent implements OnInit {
  imageSrc = 'url(\'/assets/images/food.jpg\')';
  url = environment.imgUrl;
  timeList = [
    {
      key: '01:00:00',
      display: '01:00 AM'
    },
    {
      key: '02:00:00',
      display: '02:00 AM'
    },
    {
      key: '03:00:00',
      display: '03:00 AM'
    },
    {
      key: '04:00:00',
      display: '04:00 AM'
    },
    {
      key: '05:00:00',
      display: '05:00 AM'
    },
    {
      key: '06:00:00',
      display: '06:00 AM'
    },
    {
      key: '07:00:00',
      display: '07:00 AM'
    },
    {
      key: '08:00:00',
      display: '08:00 AM'
    },
    {
      key: '09:00:00',
      display: '09:00 AM'
    },
    {
      key: '10:00:00',
      display: '10:00 AM'
    },
    {
      key: '11:00:00',
      display: '11:00 AM'
    },
    {
      key: '12:00:00',
      display: '12:00 PM'
    },
    {
      key: '13:00:00',
      display: '01:00 PM'
    },
    {
      key: '14:00:00',
      display: '02:00 PM'
    },
    {
      key: '15:00:00',
      display: '03:00 PM'
    },
    {
      key: '16:00:00',
      display: '04:00 PM'
    },
    {
      key: '17:00:00',
      display: '05:00 PM'
    },
    {
      key: '18:00:00',
      display: '06:00 PM'
    },
    {
      key: '19:00:00',
      display: '07:00 PM'
    },
    {
      key: '20:00:00',
      display: '08:00 PM'
    },
    {
      key: '21:00:00',
      display: '09:00 PM'
    },
    {
      key: '22:00:00',
      display: '10:00 PM'
    },
    {
      key: '23:00:00',
      display: '11:00 PM'
    },
    {
      key: '24:00:00',
      display: '12:00 AM'
    },
  ];
  form: FormGroup = this.fb.group({
        id: [''],
        menuTitle: [''],
        description: [''],
        startTime: [''],
        endTime: [''],
        isActive: [true],
        branch_id: [''],
        company_id: [''],
        items: this.fb.array([]),
        comboItems: this.fb.array([]),
  });
  favoriteMenuId: any;
  userData: any;
  companyList;
  branchList: any[];
  productList: any[] = [];
  productComboList: any[] = [];

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  constructor(
    private serv: DataService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
    ) {
      this.favoriteMenuId = this.route.snapshot.params.id;

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
    if (this.favoriteMenuId) {
      this.getFavMenuDetails();
    }
  }

  get items(){
    const form = this.form.get('items') as FormArray;
    return form;
  }


  addItem(){
    return this.fb.group({
      id: [''],
      productId: ['', [RxwebValidators.unique()]],
      deletedFlag: [false]
    });
  }

  addAnotherItem() {
    const form = this.addItem();
    this.items.push(form);
  }

  removeItem(item, index){
    if (this.serv.notNull(item.get('id').value)) {
      item.get('deletedFlag').setValue(true);
    }else {
      this.items.removeAt(index);
    }
  }

  get comboItems(){
    const form = this.form.get('comboItems') as FormArray;
    return form;
  }


  addComboItem(){
    return this.fb.group({
      id: [''],
      comboId: ['', [RxwebValidators.unique()]],
      deletedFlag: [false]
    });
  }

  addAnotherComboItem() {
    const form = this.addComboItem();
    this.comboItems.push(form);
  }

  removeComboItem(item, index){
    if (this.serv.notNull(item.get('id').value)) {
      item.get('deletedFlag').setValue(true);
    }else {
      this.comboItems.removeAt(index);
    }
  }

  getFavMenuDetails() {
    this.serv.endpoint = 'order-manager/favorite-menu/' + this.favoriteMenuId;
    this.serv.get().subscribe((data: any) => {
      this.form.patchValue(data);
      this.items.controls = [];
      this.comboItems.controls = [];
      data.favorite_items.forEach((elem, index) => {
          const form = this.addItem();
          form.patchValue({
            id: elem.id,
            productId: elem.productId
          });
          this.items.push(form);
      });
      data.favorite_combo_items.forEach((elem, index) => {
        const form = this.addComboItem();
        form.patchValue({
          id: elem.id,
          comboId: elem.comboId
        });
        this.comboItems.push(form);
      });
    });
  }

  saveFavMenu(event) {
    if (event != null) {event.preventDefault(); }
    this.form.markAllAsTouched();
    if (this.form.invalid) {return; }
    const formValue = {...this.form.value};
    formValue.items.forEach(elem => {
      delete elem.variationList;
    });
    this.serv.endpoint = 'order-manager/favorite-menu';
    this.serv.post(formValue).subscribe(response => {
      this.serv.showMessage('Favorite menu updated successfully', 'success');
      this.router.navigateByUrl('/admin/favorite-menu');
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
      if (this.favoriteMenuId === undefined && this.branchList.length > 0) {
        this.form.get('branch_id').setValue(this.branchList[0].id);
        this.getBranchProducts(this.branchList[0].id);
      }

      this.form.get('branch_id').valueChanges.subscribe(value => {
        this.getBranchProducts(value);
      });
    });
  }

  clearAllItems() {
      this.items.controls.forEach((control, i) => {
        this.removeItem(control, i);
      });
  }

  getBranchProducts(branchId) {
    if (!this.serv.notNull(branchId)){
      this.productList = [];
      this.clearAllItems();
      return;
    }
    this.serv.endpoint = 'order-manager/product?fields=id,productName,isAdvancedPricing&branch_id=' + branchId;
    this.serv.get().subscribe((response: any) => {
      this.productList = response;
    });
    this.serv.endpoint = 'order-manager/product-combo?fields=id,comboTitle&branch_id=' + branchId;
    this.serv.get().subscribe((response: any) => {
      this.productComboList = response;
    });
  }

}
