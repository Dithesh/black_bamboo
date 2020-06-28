import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DataService } from 'src/app/shared/services/data.service';


@Component({
  selector: 'app-branches-setting',
  templateUrl: './branches-setting.component.html',
  styleUrls: ['./branches-setting.component.scss']
})
export class BranchesSettingComponent implements OnInit {

  displayedColumns: string[] = ['action', 'branchCode', 'branchTitle', 'description', 'branchAddress', 'isActive'];
  dataSource;
  sidemenu=false;
  form:FormGroup;

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  constructor(
    private _serv: DataService,
    private fb: FormBuilder
  ) { 
    this.form = this.fb.group({
      id: [''],
      branchCode: [''],
      branchTitle: [''],
      description: [''],
      branchAddress: [''],
      isActive: [false]
    })
  }

  ngOnInit(): void {
    // this.dataSource.sort = this.sort;
    // this.dataSource.paginator = this.paginator;
    this.getAllBranches();
  }

  getAllBranches(page=1) {
    this._serv.endpoint = "order-manager/branch?pageNumber="+page;
    this._serv.get().subscribe(response => {
      this.dataSource = response as any;
      
    })
  }

  changeStatus(data) {
    this._serv.endpoint="order-manager/branch/status/"+data.id;
    this._serv.put(data).subscribe(response => {
          
    })
  }

  updateBranch(item = null) {
    if(item == null) {
      this.form.reset();
    }else {
      this.form.patchValue(item);
    }
    this.sidemenu = true;
  }

  cancelUpdate() {
    this.sidemenu=false;
    this.form.reset();
  }

  saveBranch(event=null) {
    if(event!=null)event.preventDefault();
    this.form.markAllAsTouched();
    if(this.form.invalid)return;
    let formValue = this.form.value;
    this._serv.endpoint="order-manager/branch";
    let apiCall=null;
    if(formValue.id && formValue.id != null && formValue.id !=undefined){
      this._serv.endpoint+='/'+formValue.id;
      apiCall = this._serv.put(formValue);
    }else {
      apiCall = this._serv.post(formValue);
    }
    apiCall.subscribe(response => {
      this.cancelUpdate();
      this.getAllBranches();
    })
  }

}
