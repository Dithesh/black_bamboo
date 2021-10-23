import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import {DataService} from "../../../shared/services/data.service";
import {MatDialog} from "@angular/material/dialog";
import {ActivatedRoute} from "@angular/router";
import {merge} from "rxjs";
import {debounceTime} from "rxjs/operators";
import {ConfirmPopupComponent} from "../../../shared/components/confirm-popup/confirm-popup.component";

@Component({
  selector: 'app-favorite-product-list',
  templateUrl: './favorite-product-list.component.html',
  styleUrls: ['./favorite-product-list.component.scss']
})
export class FavoriteProductListComponent implements OnInit, AfterViewInit, OnDestroy {

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
      this.getFavoriteMenuList();
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
    merge(this.sort.sortChange, this.paginator.page).pipe(
      debounceTime(500)
    ).subscribe(data => {
        this.filterForm.patchValue({
          orderCol: this.sort.active,
          orderType: this.sort.direction
        });
        this.getFavoriteMenuList(this.paginator.pageIndex + 1);
      });
    this.filterForm.get('searchString').valueChanges.pipe(
      debounceTime(500)
    ).subscribe(data => {
        this.getFavoriteMenuList();
      });
  }

  getAllBranches() {
    this.branchList = [];
    this.serv.endpoint = 'order-manager/branch?status=active&companyId=' + this.filterForm.get('selectedCompany').value;
    this.serv.get().subscribe((response: any[]) => {
      this.branchList = response;
    });
  }

  getFavoriteMenuList(page = 1) {
    const filterValue = this.filterForm.value;
    this.serv.endpoint = 'order-manager/favorite-menu';
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
    this.serv.endpoint = 'order-manager/favorite-menu/status/' + data.id;
    this.serv.put(data).subscribe(response => {
      this.serv.showMessage('Favorite menu status changed successfully', 'success');
    }, ({error}) => {
      this.serv.showMessage(error.msg, 'error');
    });
  }

  deleteFavoriteMenu(item) {
    const dialogRef = this.dialog.open(ConfirmPopupComponent);
    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        this.serv.endpoint = 'order-manager/favorite-menu/' + item.id;
        this.serv.delete().subscribe(response => {
          this.serv.showMessage('Favorite menu deleted successfully', 'success');
          this.getFavoriteMenuList();
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
