import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { DataService } from 'src/app/shared/services/data.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-categories-setting',
  templateUrl: './categories-setting.component.html',
  styleUrls: ['./categories-setting.component.scss']
})
export class CategoriesSettingComponent implements OnInit {
  displayedColumns: string[] = ['action', 'categoryName', 'description', 'branch', 'isActive'];
  dataSource;
  sidemenu=false;
  form:FormGroup;
  branchList: any[];

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  constructor(
    private _serv: DataService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      id: [''],
      categoryName: [''],
      description: [''],
      branch_id: [''],
      isActive: [false]
    })
   }

  ngOnInit(): void {
    // this.dataSource.sort = this.sort;
    // this.dataSource.paginator = this.paginator;

    this.getAllCategories();
    this.getAllBranches();
  }

  getAllCategories(page=1) {
    this._serv.endpoint = "order-manager/category?pageNumber="+page;
    this._serv.get().subscribe(response => {
      this.dataSource = response as any;
      
    })
  }

  changeStatus(data) {
    this._serv.endpoint="order-manager/category/status/"+data.id;
    this._serv.put(data).subscribe(response => {
          
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
      this.cancelUpdate();
      this.getAllCategories();
    })
  }

  getAllBranches() {
    this._serv.endpoint = "order-manager/branch?fields=id,branchTitle";
    this._serv.get().subscribe(response => {
      this.branchList = response as any[];
    })
  }

}
