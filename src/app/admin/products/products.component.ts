import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

export interface PeriodicElement {
  action:any;
  productno:number;
  title: string;
  category: string;
  price:string;
  tax:number;
  branch: string;
}

const TABLE_DATA: PeriodicElement[] = [
  {action:'', productno:1354, title: 'Tabel', category: 'delivered', price: '100 Rs', tax:15.5, branch: 'mangalore'},
  {action:'', productno:1354, title: 'Parcel', category: 'delivered', price: '100 Rs', tax:15.5, branch: 'mangalore'},
  {action:'', productno:1354, title: 'Taken', category: 'delivered', price: '100 Rs', tax:15.5, branch: 'mangalore'},
  {action:'', productno:1354, title: 'table', category: 'delivered', price: '100 Rs', tax:15.5, branch: 'mangalore'},
  {action:'', productno:1354, title: 'Hydrogen', category: 'delivered', price: '100 Rs', tax:15.5, branch: 'mangalore'},
];

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  displayedColumns: string[] = ['action', 'productno', 'title', 'category', 'price', 'tax', 'branch'];
  dataSource = new MatTableDataSource(TABLE_DATA);

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  constructor() { }

  ngOnInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
