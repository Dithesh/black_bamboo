import { merge } from 'rxjs';
import { DataService } from './../../../../shared/services/data.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormGroup, FormBuilder } from '@angular/forms';
import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import * as moment from 'moment';
import { ConfirmPopupComponent } from 'src/app/shared/components/confirm-popup/confirm-popup.component';
import { MatDialog } from '@angular/material/dialog';
import {ActivatedRoute} from '@angular/router';
import {debounceTime} from "rxjs/operators";

@Component({
  selector: 'app-order-lists',
  templateUrl: './order-lists.component.html',
  styleUrls: ['./order-lists.component.scss']
})
export class OrderListsComponent implements OnInit, AfterViewInit, OnDestroy {
  orderStatus = ['new', 'completed', 'cancelled'];

  dataSource;
  filterOn = false;
  filterForm: FormGroup;
  userData;
  companyList: any[] = [];
  branchList: any[] = [];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  private selectedCompanySubscriber;

  constructor(
    private serv: DataService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private route: ActivatedRoute
  ) {
    this.filterForm = this.fb.group({
      searchString: [''],
      orderStatus: [''],
      startDate: [''],
      selectedCompany: [''],
      selectedBranch: [''],
      endDate: [''],
      orderCol: [''],
      orderType: ['']
    });

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
      this.getOrderList();
    }
  }

  ngOnInit(): void {
    this.selectedCompanySubscriber = this.filterForm.get('selectedCompany').valueChanges.pipe(
      debounceTime(500)
    ).subscribe(response => {
      this.filterForm.get('selectedBranch').setValue('', {emitEvent: false});
      this.branchList = [];
      this.getAllBranches();
    });
  }

  ngAfterViewInit() {

    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    merge(this.sort.sortChange,
          this.paginator.page,
          this.filterForm.get('searchString').valueChanges,
          this.filterForm.get('orderStatus').valueChanges,
          this.filterForm.get('endDate').valueChanges)
      .subscribe(data => {
        this.filterForm.patchValue({
          orderCol: this.sort.active,
          orderType: this.sort.direction
        }, { emitEvent: false });
        this.getOrderList(this.paginator.pageIndex + 1);
      });
  }
  getAllBranches() {
    this.serv.endpoint = 'order-manager/branch?status=active&companyId=' + this.filterForm.get('selectedCompany').value;
    this.serv.get().subscribe((response: any[]) => {
      this.branchList = response;
    });
  }

  getOrderList(page= 1) {
    const filterValue = this.filterForm.value;
    let startDate = '';
    let endDate = '';
    if (this.serv.notNull(filterValue.startDate) && this.serv.notNull(filterValue.endDate)) {
      startDate = moment(filterValue.startDate).format('YYYY-MM-DD');
      endDate = moment(filterValue.endDate).format('YYYY-MM-DD');
    }
    this.serv.endpoint = 'order-manager/order'
    this.serv.getByParam({
      pageNumber: page,
      searchString: filterValue.searchString,
      orderStatus: filterValue.orderStatus,
      startDate,
      endDate,
      company_id: filterValue.selectedCompany,
      branch_id: filterValue.selectedBranch,
      orderType: filterValue.orderType,
      orderCol: filterValue.orderCol
    }).subscribe(response => {
      this.dataSource = response as any;
      this.dataSource.data = this.dataSource.data.map(x => {
        return {
          ...x,
          isSelected: false
        };
      });
    });
  }

  getSelectedOrderCount(){
    let count = 0;
    if (this.dataSource){
      this.dataSource.data.forEach(elem => {
        if (elem.isSelected){
          count++;
        }
      });
    }
    return count;
  }

  deleteSelectedOrders() {
    const dialogRef = this.dialog.open(ConfirmPopupComponent);
    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        const orderIds = this.dataSource.data.filter(x => x.isSelected).map(x => x.id);
        this.serv.endpoint = 'order-manager/order/' + orderIds.join(',');
        this.serv.delete().subscribe(response => {
          this.serv.showMessage('Orders deleted successfully', 'success');
          this.getOrderList();
        }, ({error}) => {
          this.serv.showMessage(error.msg, 'error');
        });
      }
    });
  }
  ngOnDestroy() {
    if (this.selectedCompanySubscriber){
      this.selectedCompanySubscriber.unsubscribe();
    }
  }

}
