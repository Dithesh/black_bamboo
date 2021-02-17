import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DataService } from 'src/app/shared/services/data.service';
import * as XLSX from 'xlsx'; 
import * as math from 'exact-math';
import * as moment from 'moment';

@Component({
  selector: 'app-order-report',
  templateUrl: './order-report.component.html',
  styleUrls: ['./order-report.component.scss']
})
export class OrderReportComponent implements OnInit {

  orderStatus=['new','completed', 'cancelled'];
  displayedColumns: string[] = ['action', 'id', 'orderAmount', 'orderStatus', 'created_at'];
  filterForm:FormGroup;
  orderTypeList: any[];
  paymentMethodList: any[];
  fileName= 'ExcelSheet.xlsx';
  dataSource: any;
  totalOrderAmount = 0;
  @ViewChild('reportTable') reportTable:any;
  branchDetail: any;
  userData: any;
  branchList: any[];
  constructor(
    private _serv: DataService,
    private fb: FormBuilder
  ) { 
    this.filterForm = this.fb.group({
      searchString: [''],
      orderStatus: [''],
      paymentMethod: [''],
      typeOfOrder: [''],
      branch_id: [''],
      startDate: [''],
      endDate: [''],
      orderCol: [''],
      orderType: ['']
    })
  }

  ngOnInit(): void {
    this.userData = this._serv.getUserData();
    if(this.userData.roles != 'Super Admin') {
      this.filterForm.get('branch_id').setValue(this.userData.branch_id);
      this.getBranchDetail(this.userData.branch_id);
    }else {
      this.getAllBranches();
    }
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
    this._serv.endpoint = "order-manager/branch?fields=id,branchTitle";
    this._serv.get().subscribe(response => {
      this.branchList = response as any[];
    })
  }
  
  getBranchDetail(branch_id) {
    if(!this._serv.notNull(branch_id)){
      this.orderTypeList=[];
      this.paymentMethodList=[];
      return;
    }
    
    this._serv.endpoint="order-manager/branch/"+branch_id;
    this._serv.get().subscribe((response:any) => {
      this.branchDetail = response;
      this.orderTypeList = response.order_types as any[];
      this.paymentMethodList = response.payment_methods as any[];
    })
  }

  
  getOrderList(event) {
    event.preventDefault()
    let filterValue = this.filterForm.value;
    let startDate="", endDate="";
    if(this._serv.notNull(filterValue.startDate) && this._serv.notNull(filterValue.endDate)) {
      startDate = moment(filterValue.startDate).format('YYYY-MM-DD');
      endDate = moment(filterValue.endDate).format('YYYY-MM-DD');
    }
    this._serv.endpoint = "order-manager/order?"
                            + "&searchString="+filterValue.searchString
                            + "&orderStatus="+filterValue.orderStatus
                            + "&branch_id="+filterValue.branch_id
                            + "&typeOfOrder="+filterValue.typeOfOrder
                            + "&paymentMethod="+filterValue.paymentMethod
                            + "&startDate="+startDate
                            + "&endDate="+endDate
                            + "&orderType="+filterValue.orderType
                            + "&orderCol="+filterValue.orderCol
    this._serv.get().subscribe(response => {
      this.dataSource = response as any;
      this.getTotal();
    })
    
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
