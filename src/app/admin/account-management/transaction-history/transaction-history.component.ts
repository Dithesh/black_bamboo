import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { merge } from 'rxjs';
import { DataService } from 'src/app/shared/services/data.service';

@Component({
  selector: 'app-transaction-history',
  templateUrl: './transaction-history.component.html',
  styleUrls: ['./transaction-history.component.scss']
})
export class TransactionHistoryComponent implements OnInit, AfterViewInit {
  selectedMenu='all';
  transactionList;
  filterForm:FormGroup;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(
    private _serv: DataService,
    private fb: FormBuilder,
    private router: Router
  ) { 
    this.filterForm = this.fb.group({
      searchString: [''],
      orderCol: [''],
      orderType: ['']
    });
  }

  ngOnInit(): void {
    this.getTransactions();
  }

  ngAfterViewInit() {
    
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    merge(this.sort.sortChange, this.paginator.page, this.filterForm.get('searchString').valueChanges)
      .subscribe(data => {
        this.filterForm.patchValue({
          orderCol: this.sort.active,
          orderType: this.sort.direction
        })
        this.getTransactions(this.paginator.pageIndex + 1)
      });
  }

  selectMenu(type) {
    this.selectedMenu=type;
    this.getTransactions()
  }

  getTransactions(page=1) {
    let formValue = this.filterForm.value;
    this._serv.endpoint = "account-manager/transaction?pageNumber="+page
                    + "&transactionType="+((this.selectedMenu=='all')?'':this.selectedMenu)
                    + "&orderCol="+formValue.orderCol
                    + "&orderType="+formValue.orderType
                    + "&searchString="+formValue.searchString;
    this._serv.get().subscribe(response => {
      this.transactionList = response as any;
      console.log(this.transactionList);
      
    })
  }

  openTransaction(item) {
    this.router.navigateByUrl('/admin/account-management/new-transaction/'+item.transactionType.toLowerCase() + '/'+item.id)
  }
}
