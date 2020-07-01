import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { DataService } from 'src/app/shared/services/data.service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  displayedColumns: string[] = ['action', 'productNumber', 'productName', 'description', 'branch', 'isActive'];
  dataSource;

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  constructor(
    private _serv: DataService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.getAllProducts();
  }

  applyFilter(event: Event) {
    // const filterValue = (event.target as HTMLInputElement).value;
    // this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getAllProducts(page=1) {
    this._serv.endpoint = "order-manager/product?pageNumber="+page;
    this._serv.get().subscribe(response => {
      this.dataSource = response as any;
    })
  }


  changeStatus(data) {
    this._serv.endpoint="order-manager/product/status/"+data.id;
    this._serv.put(data).subscribe(response => {
          
    })
  }


}
