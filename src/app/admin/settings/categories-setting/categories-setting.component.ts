import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { DataService } from 'src/app/shared/services/data.service';

@Component({
  selector: 'app-categories-setting',
  templateUrl: './categories-setting.component.html',
  styleUrls: ['./categories-setting.component.scss']
})
export class CategoriesSettingComponent implements OnInit {
  displayedColumns: string[] = ['action', 'categoryName', 'description', 'isActive'];
  dataSource;
  sidemenu=false;

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  constructor(
    private _serv: DataService
  ) { }

  ngOnInit(): void {
    // this.dataSource.sort = this.sort;
    // this.dataSource.paginator = this.paginator;

    this.getAllCategories()
  }

  getAllCategories(page=1) {
    this._serv.endpoint = "order-manager/category?pageNumber="+page;
    this._serv.get().subscribe(response => {
      this.dataSource = response as any;
      
    })
  }

  changeStatus(data) {
    this._serv.endpoint="order-manager/category/status/"+data.id;
    this._serv.put(data).subscribe(response => {
      
    })
  }

}
