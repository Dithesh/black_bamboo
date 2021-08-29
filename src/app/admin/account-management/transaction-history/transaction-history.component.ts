import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {ActivatedRoute, Router} from '@angular/router';
import { merge } from 'rxjs';
import { DataService } from 'src/app/shared/services/data.service';
import {debounceTime} from "rxjs/operators";

@Component({
  selector: 'app-transaction-history',
  templateUrl: './transaction-history.component.html',
  styleUrls: ['./transaction-history.component.scss']
})
export class TransactionHistoryComponent implements OnInit, AfterViewInit {
  accountTypeList = [
    'Bank Account',
    'Cash Account',
    'Others Account',
    'Purchase Account',
    'Sales Account',
    'Expenses',
    'Incomes',
    'Duties and Taxes',
  ];
  selectedMenu = 'all';
  transactionList;
  filterForm: FormGroup;
  companyList;
  branchList: any[] = [];
  userData;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  private selectedCompanySubscriber;
  private selectedBranchSubscriber;
  constructor(
    private serv: DataService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.filterForm = this.fb.group({
      searchString: [''],
      selectedCompany: [''],
      selectedBranch: [''],
      accountType: [''],
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
      this.getTransactions();
    }
  }

  ngOnInit(): void {
    this.selectedCompanySubscriber = this.filterForm.get('selectedCompany').valueChanges.subscribe(response => {
      this.filterForm.get('selectedBranch').setValue('', {emitEvent: false});
      this.branchList = [];
      this.getAllBranches();
    });
  }

  ngAfterViewInit() {

    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    merge(this.sort.sortChange, this.paginator.page, this.filterForm.get('searchString').valueChanges).pipe(
      debounceTime(300)
    )
      .subscribe(data => {
        this.filterForm.patchValue({
          orderCol: this.sort.active,
          orderType: this.sort.direction
        });
        this.getTransactions(this.paginator.pageIndex + 1);
      });
  }
  getAllBranches() {
    this.serv.endpoint = 'order-manager/branch?status=active&companyId=' + this.filterForm.get('selectedCompany').value;
    this.serv.get().subscribe((response: any[]) => {
      this.branchList = response;
    });
  }

  selectMenu(type) {
    this.selectedMenu = type;
    this.getTransactions();
  }

  getTransactions(page= 1) {
    const formValue = {...this.filterForm.value};
    console.log(formValue.selectedBranch)
    if(!this.serv.notNull(formValue.selectedBranch))return;
    this.serv.endpoint = 'account-manager/transaction';
    this.serv.getByParam({
      pageNumber: page,
      transactionType: ((this.selectedMenu === 'all') ? '' : this.selectedMenu),
      orderCol: formValue.orderCol,
      orderType: formValue.orderType,
      searchString: formValue.searchString,
      companyId: formValue.selectedCompany,
      branchId: formValue.selectedBranch,
      accountType: formValue.accountType,
    }).subscribe(response => {
      this.transactionList = response as any;
      console.log(this.transactionList);

    });
  }

  openTransaction(item) {
    this.router.navigateByUrl('/admin/account-management/new-transaction/' + item.transactionType.toLowerCase() + '/' + item.id);
  }
}
