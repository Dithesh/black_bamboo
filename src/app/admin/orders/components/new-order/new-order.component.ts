import { Component, OnInit, ViewChild } from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

export interface PeriodicElement {
  product: string;
  quantity: number;
  price: number;
  total: number;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {product: 1, quantity: 'Hydrogen', price: 1.0079, total: 10},
  {product: 2, quantity: 'Helium', price: 4.0026, total: 12},
];

@Component({
  selector: 'app-new-order',
  templateUrl: './new-order.component.html',
  styleUrls: ['./new-order.component.scss']
})
export class NewOrderComponent implements OnInit {
  step = 0;
  constructor() { }
  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }
 

  displayedColumns: string[] = ['product', 'quantity', 'price', 'total'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  @ViewChild(MatSort, {static: true}) sort: MatSort;

  ngOnInit() {
    this.dataSource.sort = this.sort;
  }
}

