import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DataService } from 'src/app/shared/services/data.service';
import * as XLSX from 'xlsx';
import * as math from 'exact-math';
import * as moment from 'moment';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-order-report',
  templateUrl: './order-report.component.html',
  styleUrls: ['./order-report.component.scss']
})
export class OrderReportComponent implements OnInit {

  orderStatus = ['new', 'completed', 'cancelled'];
  displayedColumns: string[] = ['action', 'id', 'orderAmount', 'orderStatus', 'created_at'];
  filterForm: FormGroup = this.fb.group({
      searchString: [''],
      orderStatus: [['completed']],
      paymentMethod: [''],
      typeOfOrder: [''],
      company_id: [''],
      branch_id: [''],
      startDate: [new Date()],
      endDate: [new Date()],
      orderCol: [''],
      orderType: ['']
  });
  companyList: any[] =[];
  orderTypeList: any[];
  paymentMethodList: any[];
  fileName = 'ExcelSheet.xlsx';
  dataSource: any;
  totalOrderAmount = 0;
  @ViewChild('reportTable') reportTable: any;
  branchDetail: any;
  userData: any;
  branchList: any[] = [];
  private selectedCompanySubscriber;
  constructor(
    private serv: DataService,
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {
    this.userData = this.serv.getUserData();
    if (this.userData.roles === 'Super Admin') {
      this.route.data.subscribe(response => {
        this.companyList = response.companyList;
      });
    } else if (this.userData.roles === 'Company Admin') {
      this.filterForm.get('company_id').setValue(this.userData.company_id);
      this.getAllBranches();
    }else {
      this.filterForm.get('company_id').setValue(this.userData.company_id);
      this.filterForm.get('branch_id').setValue(this.userData.branch_id);
      // let calOlist = function calOlist(){this.getOrderList()}; 
      this.getBranchDetail(this.getOrderList.bind(this));
      // this.getOrderList();
    }
  }

  ngOnInit(): void {
    this.selectedCompanySubscriber = this.filterForm.get('company_id').valueChanges.subscribe(response => {
      this.filterForm.get('branch_id').setValue('', {emitEvent: false});
      this.getAllBranches();
    });
  }
  // ngAfterViewInit() {

  //   this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
  //   merge(this.sort.sortChange, this.paginator.page, this.filterForm.get('searchString').valueChanges, this.filterForm.get('orderStatus').valueChanges, this.filterForm.get('endDate').valueChanges)
  //     .subscribe(data => {
  //       this.filterForm.patchValue({
  //         orderCol: this.sort.active,
  //         orderType: this.sort.direction
  //       }, { emitEvent: false })
  //       this.getOrderList(this.paginator.pageIndex + 1)
  //     });
  // }


  getAllBranches() {
    this.orderTypeList = [];
    this.paymentMethodList = [];
    this.filterForm.patchValue({
      paymentMethod: '',
      typeOfOrder: '',
      branch_id: ''
    }, { emitEvent: false });
    this.serv.endpoint = 'order-manager/branch';
    this.serv.getByParam({
      fields: 'id,branchTitle',
      company_id: this.filterForm.get('company_id').value
    }).subscribe(response => {
      this.branchList = response as any[];
    });
  }

  getBranchDetail(functionCall=null) {
    const branchId = this.filterForm.get('branch_id').value;
    if(!this.serv.notNull(branchId)){
      this.orderTypeList = [];
      this.paymentMethodList = [];
      return;
    }

    this.serv.endpoint="order-manager/branch/"+branchId;
    this.serv.get().subscribe((response:any) => {
      this.branchDetail = response;
      this.orderTypeList = response.order_types as any[];
      this.paymentMethodList = response.payment_methods as any[];
      
      if(this.orderTypeList.length > 0){
        let ordval = this.orderTypeList.map(x => x.id);
        this.filterForm.get('typeOfOrder').setValue(ordval);
      }
      if(this.paymentMethodList.length > 0){
        let payval = this.paymentMethodList.map(x => x.id);
        this.filterForm.get('paymentMethod').setValue(payval);
      }
      if(functionCall){
        functionCall();
      }
    })
    
  }


  getOrderList(event=null) {
    if(event) event.preventDefault();
    const filterValue = this.filterForm.value;
    let startDate = '';
    let endDate = '';
    if (this.serv.notNull(filterValue.startDate) && this.serv.notNull(filterValue.endDate)) {
      startDate = moment(filterValue.startDate).format('YYYY-MM-DD');
      endDate = moment(filterValue.endDate).format('YYYY-MM-DD');
    }
    this.serv.endpoint = 'order-manager/order';
    this.serv.getByParam({
      searchString: filterValue.searchString,
      orderStatus: filterValue.orderStatus,
      company_id: filterValue.company_id,
      branch_id: filterValue.branch_id,
      typeOfOrder: filterValue.typeOfOrder,
      paymentMethod: filterValue.paymentMethod,
      startDate,
      endDate,
      orderType: filterValue.orderType,
      orderCol: filterValue.orderCol
    }).subscribe(response => {
      this.dataSource = response as any;
      this.getTotal();
    });

  }
  getTotal(){
    this.totalOrderAmount=0;
    this.dataSource.forEach(element => {
      this.totalOrderAmount = math.add(this.totalOrderAmount, parseInt(element.orderAmount));
    });
  }
  exportToExcel() {
    // this.displayedColumns = ['id', 'orderAmount', 'orderStatus', 'created_at'];
    // setTimeout(() => {
      const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(this.reportTable.nativeElement)

      /* generate workbook and add the worksheet */
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

      /* save to file */
      XLSX.writeFile(wb, this.fileName);
      // this.displayedColumns = ['action', 'id', 'orderAmount', 'orderStatus', 'created_at'];
    // }, 1000)
  }
}
