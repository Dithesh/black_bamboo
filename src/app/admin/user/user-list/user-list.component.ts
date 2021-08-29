import { ConfirmPopupComponent } from 'src/app/shared/components/confirm-popup/confirm-popup.component';
import { merge } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DataService } from 'src/app/shared/services/data.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ChangePasswordComponent } from '../change-password/change-password.component';
import {ActivatedRoute} from "@angular/router";

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
  form: FormGroup;
  userData;
  companyList: any[] = [];
  branchList: any[] = [];
  filterForm: FormGroup = this.fb.group({
      searchString: [''],
      selectedCompany: [''],
      selectedBranch: [''],
      orderCol: [''],
      orderType: ['']
  });
  private selectedCompanySubscriber;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(
    public serv: DataService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private route: ActivatedRoute
  ) {
    this.userData = this.serv.getUserData();

    if (this.userData.roles === 'Super Admin') {
      this.route.data.subscribe(response => {
        this.companyList = response.companyList;
        if (this.companyList.length > 0) {
          this.filterForm.get('selectedCompany').setValue(this.companyList[0].id);
          this.getAllBranches();
        }
      });
    } else if (this.userData.roles === 'Company Admin') {
      this.filterForm.get('selectedCompany').setValue(this.userData.company_id);
      this.getAllBranches();
    }else {
      this.filterForm.get('selectedCompany').setValue(this.userData.company_id);
      this.filterForm.get('selectedBranch').setValue(this.userData.branch_id);
      this.getAllUsers();
    }
  }

  ngOnInit(): void {
    this.selectedCompanySubscriber = this.filterForm.get('selectedCompany').valueChanges.subscribe(response => {
      this.filterForm.get('selectedBranch').setValue('', {emitEvent: false});
      this.getAllBranches();
    });
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

  getAllBranches() {
    this.branchList = [];
    this.serv.endpoint = 'order-manager/branch?status=active&companyId=' + this.filterForm.get('selectedCompany').value;
    this.serv.get().subscribe((response: any[]) => {
      this.branchList = response;
    });
  }
  getAllUsers(page= 1) {
    const filterValue = this.filterForm.value;
    this.serv.endpoint = 'order-manager/user';
    this.serv.getByParam({
      pageNumber: page,
      orderType: filterValue.orderType,
      company_id: filterValue.selectedCompany,
      branch_id: filterValue.selectedBranch,
      orderCol: filterValue.orderCol,
      searchString: filterValue.searchString
    }).subscribe(response => {
      this.dataSource = response as any;
    })
  }

  deleteUser(item) {
    let dialogRef = this.dialog.open(ConfirmPopupComponent);
    dialogRef.afterClosed().subscribe(data => {
      if(data) {
        this.serv.endpoint = "order-manager/user/"+item.id;
        this.serv.delete().subscribe(response => {
          this.serv.showMessage("User deleted successfully", 'success');
          this.getAllUsers();
        }, ({error}) => {
          this.serv.showMessage(error['msg'], 'error');
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
