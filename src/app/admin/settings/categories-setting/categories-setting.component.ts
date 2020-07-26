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
    let apiCall=null;
    if(formValue.id && formValue.id != null && formValue.id !=undefined){
      this._serv.endpoint+='/'+formValue.id;
      apiCall = this._serv.put(formValue);
    }else {
      apiCall = this._serv.post(formValue);
    }
    apiCall.subscribe(response => {
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
