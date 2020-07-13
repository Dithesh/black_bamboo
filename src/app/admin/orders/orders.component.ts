import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { FormGroup } from '@angular/forms';
import { DataService } from 'src/app/shared/services/data.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  
  displayedColumns: string[] = ['action', 'orderId', 'orderType', 'orderAmount', 'orderStatus', 'created_at'];
  dataSource;
  filterOn=false;
  filterForm:FormGroup;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private _serv: DataService
  ) { }

  ngOnInit(): void {
      this.getOrderList();
  }

  getOrderList(page=1) {
    this._serv.endpoint = "order-manager/order?pageNumber=1";
    this._serv.get().subscribe(response => {
      this.dataSource = response as any;
    })
  }

}
