import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DataService } from './../../../../shared/services/data.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { debounceTime } from 'rxjs/operators';
import * as moment from 'moment';
import { id } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-custom-report',
  templateUrl: './custom-report.component.html',
  styleUrls: ['./custom-report.component.scss']
})
export class CustomReportComponent implements OnInit {

  displayedColumns: string[] = ['action', 'branchCode', 'branchTitle', 'description', 'branchAddress', 'isActive'];
  dataSource;
  filterForm:FormGroup;
  companyList;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  transactionList: any[]=[];
  orderList: any[]=[];
  orderSummary:AccountReportSummary = new AccountReportSummary();
  constructor(
    private _serv: DataService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private route:ActivatedRoute
  ) { 
    this.route.data.subscribe(response => {
      this.companyList = response.companyList;
    })
    this.filterForm = this.fb.group({
      type: this.fb.group({
        Sales: true,
        Purchase: true,
        Payment: true,
        Receipt: true
      }),
      company_id: [''],
      branch_id: [''],
      includeOrder:[false],
      startDate:[new Date()],
      endDate:[new Date()],
      orderCol: [''],
      orderType: [''],
      companyFilter:['']
    });

    this.filterForm.valueChanges.pipe(
      debounceTime(1200)
    ).subscribe(response => {
      this.getConsolidatedReports();
    })
    
  }

  ngOnInit(): void {
    // this.dataSource.sort = this.sort;
    // this.dataSource.paginator = this.paginator;
    // this.getAllBranches();
  }

  getAllBranches() {
    let filterValue=this.filterForm.value;
    this._serv.endpoint = "order-manager/branch?companyId="+this.filterForm.get('company_id').value;
    this._serv.get().subscribe(response => {
      this.dataSource = response as any;
    })
  }

  getConsolidatedReports() {
    let formValue = {...this.filterForm.value};
    formValue['requiredTypes'] = Object.keys(formValue.type).filter(x => formValue.type[x]).map((key) => key).join(',');
    if(this._serv.notNull(formValue.startDate) && this._serv.notNull(formValue.endDate)) {
      formValue.startDate = moment(formValue.startDate).format('YYYY-MM-DD');
      formValue.endDate = moment(formValue.endDate).format('YYYY-MM-DD');
    }
    this._serv.endpoint = "account-manager/transaction/consolidated-report?requiredTypes="+formValue.requiredTypes
                                                                + "&startDate="+formValue.startDate
                                                                + "&endDate="+formValue.endDate
                                                                + "&includeOrders="+formValue.includeOrders;
    this._serv.get().subscribe((response:any) => {
      this.orderSummary=new AccountReportSummary();
      this.transactionList = response.transactions as any[];
      this.transactionList.forEach(elem => {
        if(elem.transactionType == 'Sales'){
          this.orderSummary.salesTotal = this.orderSummary.salesTotal + parseFloat(elem.grandTotal)
        }else if(elem.transactionType == 'Puchase'){
          this.orderSummary.purchaseTotal = this.orderSummary.purchaseTotal + parseFloat(elem.grandTotal)
        }else if(elem.transactionType == 'Payment'){
          this.orderSummary.paymentTotal = this.orderSummary.paymentTotal + parseFloat(elem.grandTotal)
        }else if(elem.transactionType == 'Receipt'){
          this.orderSummary.receiptTotal = this.orderSummary.receiptTotal + parseFloat(elem.grandTotal)
        }
        this.orderSummary.transactionTotal = this.orderSummary.transactionTotal + parseFloat(elem.grandTotal);
      })
      this.orderList = response.orders as any[];
      this.orderList.forEach(elem => {
        this.orderSummary.ordersTotal = this.orderSummary.ordersTotal + elem.orderAmount;
      })
    })
  }

  get Sales() {
    return this.filterForm.get('type').get('Sales');
  }

  get Purchase() {
    return this.filterForm.get('type').get('Purchase');
  }

  get Payment() {
    return this.filterForm.get('type').get('Payment');
  }

  get Receipt() {
    return this.filterForm.get('type').get('Receipt');
  }

  get Orders() {
    return this.filterForm.get('includeOrder');
  }
}

export class AccountReportSummary {
  constructor(
    public salesTotal=0,
    public purchaseTotal=0,
    public paymentTotal=0,
    public receiptTotal=0,
    public transactionTotal=0,
    public ordersTotal=0
  ){}
}