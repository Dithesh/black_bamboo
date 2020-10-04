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
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {
  imageSrc="url(\'/assets/images/food.jpg\')";
  url = environment.domain;
  form: FormGroup;
  branchList: any[];
  productId: any;
  categoryList: any[];
  kitchenList: any[];
  userData: any;
;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
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
        image: [''],
        price: [''],
        taxPercent: [''],
        packagingCharges: [''],
        isActive: [true],
        branch_id: [''],
        isVeg: [false],
        isOutOfStock: [false],
        kitchen_id: [''],
      })
    }

  ngOnInit(): void {
    this.userData = this._serv.getUserData();
    if(this.productId) {
      this.getProductDetails();
    }
    if(this.userData.roles != 'Super Admin') {
        this.form.get('branch_id').setValue(this.userData.branch_id);
        this.getBranchDetails(this.userData.branch_id);
    }else{
      this.getAllBranches();
    }
    this.getAllCategories();
  }

  getProductDetails() {
    this._serv.endpoint = "order-manager/product/"+this.productId;
    this._serv.get().subscribe((data:any) => {
      data.categories = data.categories.map(x => x.id);
      this.form.patchValue(data);
      this.getBranchDetails(data.branch_id)
      
      if(this._serv.notNull(data.featuredImage)){
        
        this.imageSrc = "url(\'"+ this.url + data.featuredImage +"\')"
      }
      // data.tables.forEach(elem => {
      //   this.tables.push(this.addTable(elem));
      //   this.dataSource.next(this.tables.controls);
      // })
    })
  }

  saveProduct($event) {
    if(event!=null)event.preventDefault();
    this.form.markAllAsTouched();
    if(this.form.invalid)return;
    let formValue = this.form.value;
    this._serv.endpoint="order-manager/product";
    this._serv.post(formValue).subscribe(response => {
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
        this.getBranchDetails(this.branchList[0].id)
      }
      
      this.form.get('branch_id').valueChanges.subscribe(value => {
        this.form.get('kitchen_id').setValue('');
        this.getBranchDetails(value)
      });
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

  getBranchDetails(branch_id) {
    if(!this._serv.notNull(branch_id)){
      this.kitchenList=[];
      return;
    }
    this._serv.endpoint="order-manager/branch/"+branch_id;
    this._serv.get().subscribe((response:any) => {
      this.kitchenList = response.kitchens as any[];
    })
  }

}
