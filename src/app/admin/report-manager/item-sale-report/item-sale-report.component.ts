import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DataService } from 'src/app/shared/services/data.service';
import * as XLSX from 'xlsx';
import * as math from 'exact-math';
import * as moment from 'moment';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-item-sale-report',
  templateUrl: './item-sale-report.component.html',
  styleUrls: ['./item-sale-report.component.scss']
})
export class ItemSaleReportComponent implements OnInit {

  filterForm: FormGroup = this.fb.group({
      searchString: [''],
      startDate: [''],
      selectedCompany: [''],
      selectedBranch: [''],
      endDate: [''],
      orderCol: [''],
      orderType: ['']
  });
  fileName = 'sales-report';
  @ViewChild('reportTable') reportTable: any;
  userData: any;
  companyList: any[] = [];
  branchList: any[] = [];
  itemList;
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
    }
  }

  ngOnInit(): void {
    this.selectedCompanySubscriber = this.filterForm.get('selectedCompany').valueChanges.subscribe(response => {
      this.filterForm.get('selectedBranch').setValue('', {emitEvent: false});
      this.getAllBranches();
    });
  }
  getAllBranches() {
    this.branchList = [];
    this.serv.endpoint = 'order-manager/branch?status=active&companyId=' + this.filterForm.get('selectedCompany').value;
    this.serv.get().subscribe((response: any[]) => {
      this.branchList = response;
    });
  }
  getOrderItemSalesList(event) {
    event.preventDefault();
    const filterValue = this.filterForm.value;
    let startDate = '', endDate = '';
    if (this.serv.notNull(filterValue.startDate) && this.serv.notNull(filterValue.endDate)) {
      startDate = moment(filterValue.startDate).format('YYYY-MM-DD');
      endDate = moment(filterValue.endDate).format('YYYY-MM-DD');
    }
    this.serv.endpoint = 'order-manager/order/item-sales-report';
    this.serv.getByParam({
      searchString: filterValue.searchString,
      company_id: filterValue.selectedCompany,
      branch_id: filterValue.selectedBranch,
      startDate,
      endDate,
      orderType: filterValue.orderType,
      orderCol: filterValue.orderCol
    }).subscribe(response => {
      const result = [];
      Object.keys(response).forEach(key => {
        const res = {};
        const items = response[key];
        res['productName'] = items[0].productName;
        res['isSingle'] = !items[0].isAdvancedPricing;
        res['items'] = items;
        result.push(res);
      });
      this.itemList = result;
      console.log(this.itemList);

    });

  }
  exportToExcel() {
    // this.displayedColumns = ['id', 'orderAmount', 'orderStatus', 'created_at'];
    // setTimeout(() => {
      const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.reportTable.nativeElement);

      /* generate workbook and add the worksheet */
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      const filename = this.fileName + moment(new Date()).format('DD-MM-YYYY-HH-mm') + '.xlsx';
      /* save to file */
      XLSX.writeFile(wb, filename);
      // this.displayedColumns = ['action', 'id', 'orderAmount', 'orderStatus', 'created_at'];
    // }, 1000)
  }
}
