import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';


export interface PeriodicElement {
  action:any;
  questions: string;
  type:string;
}

const TABLE_DATA: PeriodicElement[] = [
  {action:'', questions: 'Tabel', type: 'delivered'},
  {action:'', questions: 'Parcel', type: 'delivered'},
  {action:'', questions: 'Taken', type: 'delivered'},
  {action:'', questions: 'table', type: 'delivered'},
  {action:'', questions: 'Hydrogen', type: 'delivered'},
];

@Component({
  selector: 'app-feedback-setting',
  templateUrl: './feedback-setting.component.html',
  styleUrls: ['./feedback-setting.component.scss']
})
export class FeedbackSettingComponent implements OnInit {

  displayedColumns: string[] = ['action', 'questions', 'type'];
  dataSource = new MatTableDataSource(TABLE_DATA);

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  constructor() { }

  ngOnInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

}
