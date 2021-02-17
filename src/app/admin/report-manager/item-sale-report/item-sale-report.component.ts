import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DataService } from 'src/app/shared/services/data.service';
import * as XLSX from 'xlsx'; 
import * as math from 'exact-math';
import * as moment from 'moment';

@Component({
  selector: 'app-item-sale-report',
  templateUrl: './item-sale-report.component.html',
  styleUrls: ['./item-sale-report.component.scss']
})
export class ItemSaleReportComponent implements OnInit {

  filterForm:FormGroup;
  fileName= 'sales-report';
  @ViewChild('reportTable') reportTable:any;
  userData: any;
  itemList;
  constructor(
    private _serv: DataService,
    private fb: FormBuilder
  ) { 
    this.filterForm = this.fb.group({
      searchString: [''],
      startDate: [''],
      endDate: [''],
      orderCol: [''],
      orderType: ['']
    })
  }

  ngOnInit(): void {
  }


  
  getOrderItemSalesList(event) {
    event.preventDefault()
    let filterValue = this.filterForm.value;
    let startDate="", endDate="";
    if(this._serv.notNull(filterValue.startDate) && this._serv.notNull(filterValue.endDate)) {
      startDate = moment(filterValue.startDate).format('YYYY-MM-DD');
      endDate = moment(filterValue.endDate).format('YYYY-MM-DD');
    }
    this._serv.endpoint = "order-manager/order/item-sales-report?"
                            + "&searchString="+filterValue.searchString
                            + "&startDate="+startDate
                            + "&endDate="+endDate
                            + "&orderType="+filterValue.orderType
                            + "&orderCol="+filterValue.orderCol
    this._serv.get().subscribe(response => {
      let result = [];
      Object.keys(response).forEach(key => {
        let res = {};
        let items = response[key];
        res['productName']=items[0].productName;
        res['isSingle']=!items[0].isAdvancedPricing;
        res['items']=items;
        result.push(res);
      })
      this.itemList = result;
      console.log(this.itemList);
      
    })
    
  }
  exportToExcel() {
    // this.displayedColumns = ['id', 'orderAmount', 'orderStatus', 'created_at'];
    // setTimeout(() => {
      const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(this.reportTable.nativeElement)
 
      /* generate workbook and add the worksheet */
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    let filename= this.fileName + moment(new Date()).format('DD-MM-YYYY-HH-mm') + '.xlsx'
      /* save to file */
      XLSX.writeFile(wb, filename);
      // this.displayedColumns = ['action', 'id', 'orderAmount', 'orderStatus', 'created_at'];
    // }, 1000)
  }
}
