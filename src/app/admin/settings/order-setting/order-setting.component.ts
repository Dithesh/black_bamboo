import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { DataService } from 'src/app/shared/services/data.service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-order-setting',
  templateUrl: './order-setting.component.html',
  styleUrls: ['./order-setting.component.scss']
})
export class OrderSettingComponent implements OnInit {

  displayedColumns: string[] = ['action', 'typeName', 'description', 'branch', 'isActive'];
  dataSource;

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  constructor(
    private _serv: DataService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.getOrderTypes();
  }

  getOrderTypes(page=1) {
    this._serv.endpoint = "order-manager/order-type?pageNumber="+page;
    this._serv.get().subscribe(response => {
      this.dataSource = response as any;
    })
  }


  changeStatus(data) {
    this._serv.endpoint="order-manager/order-type/status/"+data.id;
    this._serv.put(data).subscribe(response => {
          
    })
  }
}
