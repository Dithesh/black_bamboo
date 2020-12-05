import { environment } from './../../../../environments/environment';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { DataService } from 'src/app/shared/services/data.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmPopupComponent } from 'src/app/shared/components/confirm-popup/confirm-popup.component';
import { merge } from 'rxjs';

@Component({
  selector: 'app-categories-setting',
  templateUrl: './categories-setting.component.html',
  styleUrls: ['./categories-setting.component.scss']
})
export class CategoriesSettingComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['action', 'categoryName', 'description', 'branch', 'isActive'];
  imageSrc="url(\'/assets/images/food.jpg\')";
  url = environment.imgUrl;
  dataSource;
  sidemenu=false;
  form:FormGroup;
  filterForm:FormGroup;
  branchList: any[];
  userData;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(
    private _serv: DataService,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {
    this.filterForm = this.fb.group({
      searchString: [''],
      orderCol: [''],
      orderType: ['']
    });
    this.form = this.fb.group({
      id: [''],
      image: [''],
      categoryName: [''],
      description: [''],
      branch_id: [''],
      isActive: [false]
    })
   }

  ngOnInit(): void {
    this.userData = this._serv.getUserData();
    this.getAllCategories();
    this.getAllBranches();
  }

  ngAfterViewInit() {
    
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    merge(this.sort.sortChange, this.paginator.page, this.filterForm.get('searchString').valueChanges)
      .subscribe(data => {
        this.filterForm.patchValue({
          orderCol: this.sort.active,
          orderType: this.sort.direction
        })
        this.getAllCategories(this.paginator.pageIndex + 1)
      });
  }

  getAllCategories(page=1) {
    let filterValue=this.filterForm.value;
    this._serv.endpoint = "order-manager/category?pageNumber="+page+"&orderType="+filterValue.orderType+"&orderCol="+filterValue.orderCol+"&searchString="+filterValue.searchString;
    this._serv.get().subscribe(response => {
      this.dataSource = response as any;
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

  changeStatus(data) {
    this._serv.endpoint="order-manager/category/status/"+data.id;
    this._serv.put(data).subscribe(response => {
      this._serv.showMessage("Category status changed successfully", 'success');
    }, ({error}) => {
      this._serv.showMessage(error['msg'], 'error');
    })
  }

  updateCategory(item = null) {
    if(item == null) {
      this.form.reset();
      if(this.branchList.length > 0) {
        this.form.get('branch_id').setValue(this.branchList[0].id)
      }
    }else {
      this.form.patchValue(item);
      if(this._serv.notNull(item.featuredImage)){
        this.imageSrc = "url(\'"+ this.url + item.featuredImage +"\')"
        console.log(this.imageSrc, 'img');
        
      }
    }
    this.sidemenu = true;
  }

  cancelUpdate() {
    this.sidemenu=false;
    this.form.reset();
  }

  saveCategory(event=null) {
    if(event!=null)event.preventDefault();
    this.form.markAllAsTouched();
    if(this.form.invalid)return;
    let formValue = this.form.value;
    this._serv.endpoint="order-manager/category";
    this._serv.post(formValue).subscribe(response => {
      this._serv.showMessage("Category updated successfully", 'success');
      this.cancelUpdate();
      this.getAllCategories();
    }, ({error}) => {
      this._serv.showMessage(error['msg'], 'error');
    })
  }

  getAllBranches() {
    this._serv.endpoint = "order-manager/branch?fields=id,branchTitle";
    this._serv.get().subscribe(response => {
      this.branchList = response as any[];
    })
  }

  deleteCategory(item) {
    let dialogRef = this.dialog.open(ConfirmPopupComponent);
    dialogRef.afterClosed().subscribe(data => {
      if(data) {
        this._serv.endpoint = "order-manager/category/"+item.id;
        this._serv.delete().subscribe(response => {
          this._serv.showMessage("Category deleted successfully", 'success');
          this.getAllCategories();
        }, ({error}) => {
          this._serv.showMessage(error['msg'], 'error');
        })
      }
    })
  }

}
