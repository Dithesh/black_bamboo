import { ConfirmPopupComponent } from 'src/app/shared/components/confirm-popup/confirm-popup.component';
import { merge } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DataService } from 'src/app/shared/services/data.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormGroup, FormBuilder } from '@angular/forms';
import { environment } from 'src/environments/environment';
import {Component, OnInit, AfterViewInit, ViewChild, OnDestroy} from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-categories-list',
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.scss']
})
export class CategoriesListComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns: string[] = ['action', 'categoryName', 'description', 'branch', 'isActive'];
  imageSrc='url(\'/assets/images/food.jpg\')';
  url = environment.imgUrl;
  dataSource;
  sidemenu = false;
  form: FormGroup;
  filterForm: FormGroup = this.fb.group({
      searchString: [''],
      selectedCompany: [''],
      selectedBranch: [''],
      orderCol: [''],
      orderType: ['']
    });
  userData;
  companyList: any[] = [];
  branchList: any[] = [];
  private selectedCompanySubscriber;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(
    private serv: DataService,
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
      this.getAllCategories();
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
        this.getAllCategories(this.paginator.pageIndex + 1)
      });
  }

  getAllCategories(page= 1) {
    const filterValue = this.filterForm.value;
    this.serv.endpoint = 'order-manager/category';
    this.serv.getByParam({
      pageNumber: page,
      orderType: filterValue.orderType,
      companyId: filterValue.selectedCompany,
      branchId: filterValue.selectedBranch,
      orderCol: filterValue.orderCol,
      searchString: filterValue.searchString
    }).subscribe(response => {
      this.dataSource = response as any;
    })
  }

  changeStatus(data) {
    this.serv.endpoint="order-manager/category/status/"+data.id;
    this.serv.put(data).subscribe(response => {
      this.serv.showMessage("Category status changed successfully", 'success');
    }, ({error}) => {
      this.serv.showMessage(error['msg'], 'error');
    })
  }

  getAllBranches() {
    this.branchList = [];
    this.serv.endpoint = 'order-manager/branch?status=active&companyId=' + this.filterForm.get('selectedCompany').value;
    this.serv.get().subscribe((response: any[]) => {
      this.branchList = response;
    });
  }

  deleteCategory(item) {
    let dialogRef = this.dialog.open(ConfirmPopupComponent);
    dialogRef.afterClosed().subscribe(data => {
      if(data) {
        this.serv.endpoint = "order-manager/category/"+item.id;
        this.serv.delete().subscribe(response => {
          this.serv.showMessage("Category deleted successfully", 'success');
          this.getAllCategories();
        }, ({error}) => {
          this.serv.showMessage(error['msg'], 'error');
        })
      }
    })
  }

  ngOnDestroy() {
    if(this.selectedCompanySubscriber) {
      this.selectedCompanySubscriber.unsubscribe();
    }
  }

}

