import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface PeriodicElement {
  action:any;
  ordertype: string;
  price: string;
  tax: string;
}

const TABLE_DATA: PeriodicElement[] = [
  {action:'', ordertype: 'text', price: '', tax:' '},
  {action:'', ordertype: 'text', price: '', tax: ''},
];

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {

  displayedColumns: string[] = ['action', 'ordertype', 'price', 'tax'];
  dataSource = new MatTableDataSource(TABLE_DATA);
  successMessage = 'Saved Successfully';
  action ="close";
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  constructor(private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.dataSource.sort = this.sort;
  }

  openSnackBar() {
    this._snackBar.open(this.successMessage, this.action, {duration: 2000,});
  }
}
