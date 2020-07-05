import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmPopupComponent } from 'src/app/shared/components/confirm-popup/confirm-popup.component';
import { SnackService } from 'src/app/shared/services/snack.service';
import { FormGroup, FormBuilder, FormArray, AbstractControl } from '@angular/forms';
import { DataService } from 'src/app/shared/services/data.service';
import { BehaviorSubject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {
  form: FormGroup;
  displayedColumns: string[] = ['ordertype', 'price', 'packagingCharges'];
  dataSource = new BehaviorSubject<AbstractControl[]>([]);branchList: any[];
  productId: any;
  categoryList: any[];
;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  orderTypes: any[];
  constructor(
    private _serv: DataService,
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
        price: [''],
        taxPercent: [''],
        packagingCharges: [''],
        isActive: [false],
        branch_id: [''],
        isOrderTypePricing: [''],
        isVeg: [''],
        orderBasedPrice: this.fb.array([]),
      })
    }

  ngOnInit(): void {
    if(this.productId) {
      this.getProductDetails();
    }else {
      this.getOrderTypes(null);
    }
    this.getAllBranches();
    this.getAllCategories();
  }

  getProductDetails() {
    this._serv.endpoint = "order-manager/product/"+this.productId;
    this._serv.get().subscribe(response => {
      let data = response as any;
      data.categories = data.categories.map(x => x.id);
      this.form.patchValue(data);
      this.getOrderTypes(data);
      // data.tables.forEach(elem => {
      //   this.tables.push(this.addTable(elem));
      //   this.dataSource.next(this.tables.controls);
      // })
    })
  }


  get orderBasedPrice() {
    return this.form.get('orderBasedPrice') as FormArray;
  }

  getOrderTypes(productData:any) {
    this._serv.endpoint = "order-manager/order-type?fields=id,typeName";
    this._serv.get().subscribe(response => {
      this.orderTypes = response as any[];
      this.orderTypes.forEach(elem => {
        let id="", price=0, taxPercent=0, packagingCharges=0;
        if(productData) {
          productData.pricings.forEach(prod => {
              if(prod.orderTypeId == elem.id) {
                id=prod.id;
                price= prod.price;
                taxPercent= prod.taxPercent;
                packagingCharges= prod.packagingCharges;
              }
          })
        }
        this.orderBasedPrice.push(this.fb.group({
          id: [id],
          price: [price],
          taxPercent: [taxPercent],
          packagingCharges: [packagingCharges],
          orderTypeId: [elem.id],
          orderTypeName: [elem.typeName]
        }));
        this.dataSource.next(this.orderBasedPrice.controls);
      })
    })
  }

  saveProduct($event) {
    if(event!=null)event.preventDefault();
    this.form.markAllAsTouched();
    if(this.form.invalid)return;
    let formValue = this.form.value;
    this._serv.endpoint="order-manager/product";
    let apiCall=null;
    if(formValue.id && formValue.id != null && formValue.id !=undefined){
      this._serv.endpoint+='/'+formValue.id;
      apiCall = this._serv.put(formValue);
    }else {
      apiCall = this._serv.post(formValue);
    }
    apiCall.subscribe(response => {
      this._serv.showMessage("Product updated successfully", 'success');
      this.router.navigateByUrl('/admin/products');
    }, ({error}) => {
      this._serv.showMessage(error['msg'], 'error');
    })
  }

  getAllCategories() {
    this._serv.endpoint = "order-manager/category?fields=id,categoryName";
    this._serv.get().subscribe(response => {
      this.categoryList = response as any[];
    })
  }
  
  getAllBranches() {
    this._serv.endpoint = "order-manager/branch?fields=id,branchTitle";
    this._serv.get().subscribe(response => {
      this.branchList = response as any[];
      if(this.productId == undefined && this.branchList.length > 0) {
        this.form.get('branch_id').setValue(this.branchList[0].id);
      }
    })
  }

}
