import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

export interface PeriodicElement {
  action:any;
  ordertype: string;
  price: string;
  tax: string;
}

const TABLE_DATA: PeriodicElement[] = [
  {action:'', ordertype: 'text', price: '', tax:' '},
  {action:'', ordertype: 'text', price: '', tax: ''},
];

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {

  displayedColumns: string[] = ['action', 'ordertype', 'price', 'tax'];
  dataSource = new MatTableDataSource(TABLE_DATA);

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  constructor() { }

  ngOnInit(): void {
    this.dataSource.sort = this.sort;
  }

}
