import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.scss']
})
export class TransactionListComponent implements OnInit {

  displayedColumns: string[] = ['trasactionid', 'name', 'date', 'amount'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  @ViewChild(MatSort, {static: true}) sort: MatSort;

  ngOnInit() {
    this.dataSource.sort = this.sort;
  }

}

export interface PeriodicElement {
  trasactionid: number;
  name: string;
  date: number;
  amount: number;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {trasactionid: 1, name: 'Hydrogen', date: 1.0079, amount: 1500},
  {trasactionid: 2, name: 'Helium', date: 4.0026, amount: 2000},
  {trasactionid: 3, name: 'Lithium', date: 6.941, amount: 300},
];