import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { DataService } from 'src/app/shared/services/data.service';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmPopupComponent } from 'src/app/shared/components/confirm-popup/confirm-popup.component';
import { merge } from 'rxjs';

export interface PeriodicElement {
  action:any;
  name: string;
  branch: string;
  number: number;
}

const TABLE_DATA: PeriodicElement[] = [
  {action:'', name: 'jone', branch: 'Mangalore', number: 1},
  {action:'', name: 'jony', branch: 'Kudla', number: 1},
];

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['action', 'firstName', 'roles', 'branch_title', 'mobileNumber', 'email', 'isActive'];
  dataSource;
  sidemenu=false;
  form:FormGroup;
  filterForm:FormGroup;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  branchList: any[];
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
      firstName: [''],
      lastName: [''],
      roles: [''],
      email: [''],
      mobileNumber: [''],
      password: [''],
      branch_id: [''],
      isActive: [false]
    })
  }

  ngOnInit(): void {
    // this.dataSource.sort = this.sort;
    // this.dataSource.paginator = this.paginator;
    this.getAllUsers();
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
        this.getAllUsers(this.paginator.pageIndex + 1)
      });
  }

  getAllUsers(page=1) {
    let filterValue=this.filterForm.value;
    this._serv.endpoint = "order-manager/user?pageNumber="+page+"&orderType="+filterValue.orderType+"&orderCol="+filterValue.orderCol+"&searchString="+filterValue.searchString;
    this._serv.get().subscribe(response => {
      this.dataSource = response as any;
    })
  }

  getAllBranches() {
    this._serv.endpoint = "order-manager/branch?fields=id,branchTitle";
    this._serv.get().subscribe(response => {
      this.branchList = response as any[];
    })
  }


  updateUser(item = null) {
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

  saveUser(event=null) {
    if(event!=null)event.preventDefault();
    this.form.markAllAsTouched();
    if(this.form.invalid)return;
    let formValue = this.form.value;
    this._serv.endpoint="order-manager/user";
    let apiCall=null;
    if(formValue.id && formValue.id != null && formValue.id !=undefined){
      this._serv.endpoint+='/'+formValue.id;
      apiCall = this._serv.put(formValue);
    }else {
      apiCall = this._serv.post(formValue);
    }
    apiCall.subscribe(response => {
      this._serv.showMessage("User updated successfully", 'success')
      this.cancelUpdate();
      this.getAllUsers();
    }, ({error}) => {
      this._serv.showMessage(error['msg'], 'error');
    })
  }

  deleteUser(item) {
    let dialogRef = this.dialog.open(ConfirmPopupComponent);
    dialogRef.afterClosed().subscribe(data => {
      if(data) {
        this._serv.endpoint = "order-manager/user/"+item.id;
        this._serv.delete().subscribe(response => {
          this._serv.showMessage("User deleted successfully", 'success');
          this.getAllUsers();
        }, ({error}) => {
          this._serv.showMessage(error['msg'], 'error');
        })
      }
    })
  }
}
