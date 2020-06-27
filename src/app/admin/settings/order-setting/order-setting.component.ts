import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

export interface PeriodicElement {
  action:any;
  title: string;
  discription: string;
  tablerequired: boolean;
  inforequired:  boolean;
  deliverycharge: boolean;
}

const TABLE_DATA: PeriodicElement[] = [
  {action:'', title: 'Tabel', discription: 'delivered', tablerequired: true, inforequired: true, deliverycharge:true},
  {action:'', title: 'Parcel', discription: 'delivered', tablerequired: true, inforequired: true, deliverycharge:true},
  {action:'', title: 'Taken', discription: 'delivered', tablerequired: true, inforequired: true, deliverycharge:true},
  {action:'', title: 'table', discription: 'delivered', tablerequired: true, inforequired: true, deliverycharge:true},
  {action:'', title: 'Hydrogen', discription: 'delivered', tablerequired: true, inforequired: true, deliverycharge:true}
];

@Component({
  selector: 'app-order-setting',
  templateUrl: './order-setting.component.html',
  styleUrls: ['./order-setting.component.scss']
})
export class OrderSettingComponent implements OnInit {

  displayedColumns: string[] = ['action', 'title', 'discription', 'tablerequired', 'inforequired', 'deliverycharge'];
  dataSource = new MatTableDataSource(TABLE_DATA);

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  constructor() { }

  ngOnInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
}
