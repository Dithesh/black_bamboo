import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmPopupComponent } from 'src/app/shared/components/confirm-popup/confirm-popup.component';
import { SnackService } from 'src/app/shared/services/snack.service';

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
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  constructor(private _snackBar: MatSnackBar, private dialog:MatDialog, private snakBar:SnackService) { }

  ngOnInit(): void {
    this.dataSource.sort = this.sort;
  }

  openSnackBar() {
    this.snakBar.openSnackBar('Saved Successfully','close','success');
  }

  openDialog() {
    this.dialog.open(ConfirmPopupComponent);
  }
}
