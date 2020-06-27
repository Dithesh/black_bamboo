import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

export interface PeriodicElement {
  action:any;
  title: string;
  discription: string;
  address: string;
  branchcode:  number;
}

const TABLE_DATA: PeriodicElement[] = [
  {action:'', title: 'Tabel', discription: 'delivered', address: 'address here', branchcode: 122345},
  {action:'', title: 'Parcel', discription: 'delivered', address: 'address here', branchcode: 122345},
  {action:'', title: 'Taken', discription: 'delivered', address: 'address here', branchcode: 122345},
  {action:'', title: 'table', discription: 'delivered', address: 'address here', branchcode: 122345},
  {action:'', title: 'Hydrogen', discription: 'delivered', address: 'address here', branchcode: 122345},
];

@Component({
  selector: 'app-branches-setting',
  templateUrl: './branches-setting.component.html',
  styleUrls: ['./branches-setting.component.scss']
})
export class BranchesSettingComponent implements OnInit {

  displayedColumns: string[] = ['action', 'title', 'discription', 'address', 'branchcode'];
  dataSource = new MatTableDataSource(TABLE_DATA);
  sidemenu=false;
  
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  constructor() { }

  ngOnInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

}
