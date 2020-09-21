import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DataService } from 'src/app/shared/services/data.service';
import { merge } from 'rxjs';
import * as moment from 'moment';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit, AfterViewInit {
  orderStatus=['new', 'accepted', 'prepairing', 'packing', 'dispatched', 'delivered', 'completed', 'cancelled'];
  displayedColumns: string[] = ['action', 'id', 'orderAmount', 'orderStatus', 'created_at'];
  dataSource;
  filterOn=false;
  filterForm:FormGroup;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private _serv: DataService,
    private fb: FormBuilder
  ) { 
    this.filterForm = this.fb.group({
      searchString: [''],
      orderStatus: [''],
      startDate: [''],
      endDate: [''],
      orderCol: [''],
      orderType: ['']
    })
  }

  ngOnInit(): void {
      this.getOrderList();
  }

  ngAfterViewInit() {
    
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    merge(this.sort.sortChange, this.paginator.page, this.filterForm.get('searchString').valueChanges, this.filterForm.get('orderStatus').valueChanges, this.filterForm.get('endDate').valueChanges)
      .subscribe(data => {
        this.filterForm.patchValue({
          orderCol: this.sort.active,
          orderType: this.sort.direction
        }, { emitEvent: false })
        this.getOrderList(this.paginator.pageIndex + 1)
      });
  }

  getOrderList(page=1) {
    let filterValue = this.filterForm.value;
    let startDate="", endDate="";
    if(this._serv.notNull(filterValue.startDate) && this._serv.notNull(filterValue.endDate)) {
      startDate = moment(filterValue.startDate).format('YYYY-MM-DD');
      endDate = moment(filterValue.endDate).format('YYYY-MM-DD');
    }
    this._serv.endpoint = "order-manager/order?pageNumber="+page
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

}
