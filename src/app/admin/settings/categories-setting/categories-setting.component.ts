import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

export interface PeriodicElement {
  action:any;
  title: string;
  discription: string;
}

const TABLE_DATA: PeriodicElement[] = [
  {action:'', title: 'Tabel', discription: 'delivered'},
  {action:'', title: 'Parcel', discription: 'delivered'},
  {action:'', title: 'Taken', discription: 'delivered'},
  {action:'', title: 'table', discription: 'delivered'},
  {action:'', title: 'Hydrogen', discription: 'delivered'},
];

@Component({
  selector: 'app-categories-setting',
  templateUrl: './categories-setting.component.html',
  styleUrls: ['./categories-setting.component.scss']
})
export class CategoriesSettingComponent implements OnInit {
  displayedColumns: string[] = ['action', 'title', 'discription'];
  dataSource = new MatTableDataSource(TABLE_DATA);

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  constructor() { }

  ngOnInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

}
