import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

export interface PeriodicElement {
  action:any;
  orderNo: number;
  type: string;
  status: string;
  orderDate: string;
  amount: number;
}

const TABLE_DATA: PeriodicElement[] = [
  {action:'', orderNo: 1, type: 'Tabel', status: 'delivered', orderDate: 'H', amount: 200},
  {action:'', orderNo: 2, type: 'Parcel', status: 'delivered', orderDate: 'H', amount: 200},
  {action:'', orderNo: 3, type: 'Taken', status: 'delivered', orderDate: 'H', amount: 200},
  {action:'', orderNo: 4, type: 'table', status: 'delivered', orderDate: 'H', amount: 200},
  {action:'', orderNo: 5, type: 'Hydrogen', status: 'delivered', orderDate: 'H', amount: 200},
];

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  filterOn=false;
  displayedColumns: string[] = ['action', 'orderNo', 'type', 'status', 'orderDate', 'amount'];
  dataSource = new MatTableDataSource(TABLE_DATA);

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  constructor() { }

  ngOnInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

}
