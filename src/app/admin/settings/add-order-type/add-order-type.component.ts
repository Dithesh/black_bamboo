import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

export interface PeriodicElement {
  action:any;
  tableid: number;
  discription: string;
  noofchairs: string;
}

const TABLE_DATA: PeriodicElement[] = [
  {action:'', tableid: 123, discription: 'delivered', noofchairs:' '},
  {action:'', tableid: 1244, discription: 'delivered', noofchairs: ''},
];

@Component({
  selector: 'app-add-order-type',
  templateUrl: './add-order-type.component.html',
  styleUrls: ['./add-order-type.component.scss']
})
export class AddOrderTypeComponent implements OnInit {

  displayedColumns: string[] = ['action', 'tableid', 'discription', 'noofchairs'];
  dataSource = new MatTableDataSource(TABLE_DATA);

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  constructor() { }

  ngOnInit(): void {
    this.dataSource.sort = this.sort;
  }

}
