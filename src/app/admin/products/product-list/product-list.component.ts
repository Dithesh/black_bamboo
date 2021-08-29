import { merge } from 'rxjs';
import { ConfirmPopupComponent } from 'src/app/shared/components/confirm-popup/confirm-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { DataService } from 'src/app/shared/services/data.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormGroup, FormBuilder } from '@angular/forms';
import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { debounceTime } from 'rxjs/operators';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit, AfterViewInit, OnDestroy {

  // displayedColumns: string[] = ['action', 'productNumber', 'productName', 'description', 'branch', 'isActive'];
  dataSource;
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

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  private selectedCompanySubscriber;
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
      this.getAllProducts();
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
    merge(this.sort.sortChange, this.paginator.page, this.filterForm.get('searchString').valueChanges).pipe(
      debounceTime(500)
    ).subscribe(data => {
        this.filterForm.patchValue({
          orderCol: this.sort.active,
          orderType: this.sort.direction
        });
        this.getAllProducts(this.paginator.pageIndex + 1);
      });
  }

  getAllBranches() {
    this.branchList = [];
    this.serv.endpoint = 'order-manager/branch?status=active&companyId=' + this.filterForm.get('selectedCompany').value;
    this.serv.get().subscribe((response: any[]) => {
      this.branchList = response;
    });
  }

  getAllProducts(page = 1) {
    const filterValue = this.filterForm.value;
    this.serv.endpoint = 'order-manager/product';
    this.serv.getByParam({
      pageNumber: page,
      company_id: filterValue.selectedCompany,
      branch_id: filterValue.selectedBranch,
      orderType: filterValue.orderType,
      orderCol: filterValue.orderCol,
      searchString: filterValue.searchString
    }).subscribe(response => {
      this.dataSource = response as any;
    });
  }


  changeStatus(data) {
    this.serv.endpoint = 'order-manager/product/status/' + data.id;
    this.serv.put(data).subscribe(response => {
      this.serv.showMessage('Product status changed successfully', 'success');
    }, ({error}) => {
      this.serv.showMessage(error.msg, 'error');
    });
  }

  deleteProduct(item) {
    const dialogRef = this.dialog.open(ConfirmPopupComponent);
    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        this.serv.endpoint = 'order-manager/product/' + item.id;
        this.serv.delete().subscribe(response => {
          this.serv.showMessage('Product deleted successfully', 'success');
          this.getAllProducts();
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
