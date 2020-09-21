import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DataService } from 'src/app/shared/services/data.service';
import * as XLSX from 'xlsx'; 
import * as moment from 'moment';

@Component({
  selector: 'app-report-manager',
  templateUrl: './report-manager.component.html',
  styleUrls: ['./report-manager.component.scss']
})
export class ReportManagerComponent implements OnInit {

  orderStatus=['new', 'accepted', 'prepairing', 'packing', 'dispatched', 'delivered', 'completed', 'cancelled'];
  displayedColumns: string[] = ['action', 'id', 'orderAmount', 'orderStatus', 'created_at'];
  filterForm:FormGroup;
  orderTypeList: any[];
  fileName= 'ExcelSheet.xlsx';
  dataSource: any;
  @ViewChild('reportTable') reportTable:any;
  constructor(
    private _serv: DataService,
    private fb: FormBuilder
  ) { 
    this.filterForm = this.fb.group({
      searchString: [''],
      orderStatus: [''],
      typeOfOrder: [''],
      startDate: [''],
      endDate: [''],
      orderCol: [''],
      orderType: ['']
    })
  }

  ngOnInit(): void {
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
                            + "&startDate="+startDate
                            + "&endDate="+endDate
                            + "&orderType="+filterValue.orderType
                            + "&orderCol="+filterValue.orderCol
    this._serv.get().subscribe(response => {
      this.dataSource = response as any;
    })
  }

  exportToExcel() {
    this.displayedColumns = ['id', 'orderAmount', 'orderStatus', 'created_at'];
    setTimeout(() => {
      const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(this.reportTable._elementRef.nativeElement)
 
      /* generate workbook and add the worksheet */
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
 
      /* save to file */
      XLSX.writeFile(wb, this.fileName);
      this.displayedColumns = ['action', 'id', 'orderAmount', 'orderStatus', 'created_at'];
    }, 1000)
  }
}
