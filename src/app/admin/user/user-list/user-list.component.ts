import { ConfirmPopupComponent } from 'src/app/shared/components/confirm-popup/confirm-popup.component';
import { merge } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DataService } from 'src/app/shared/services/data.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ChangePasswordComponent } from '../change-password/change-password.component';

export interface PeriodicElement {
  action:any;
  name: string;
  branch: string;
  number: number;
}


@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit, AfterViewInit {

  dataSource;
  sidemenu=false;
  form:FormGroup;
  filterForm:FormGroup;
  userData;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  branchList: any[];
  constructor(
    public _serv: DataService,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {
    this.filterForm = this.fb.group({
      searchString: [''],
      orderCol: [''],
      orderType: ['']
    });

  }

  ngOnInit(): void {
    this.getAllUsers();
    this.userData = this._serv.getUserData();

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

  changeOtherUserPassword(user) {
    let dialogRf = this.dialog.open(ChangePasswordComponent, {
      data: {
        userId: user.id
      }
    });
  }
}
