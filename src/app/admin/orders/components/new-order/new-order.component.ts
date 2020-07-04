import { Component, OnInit, ViewChild } from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { OwlOptions } from 'ngx-owl-carousel-o';

export interface PeriodicElement {
  product: string;
  quantity: number;
  price: number;
  total: number;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {product: 'item', quantity: 1, price: 1.0079, total: 10},
  {product: 'item', quantity: 2, price: 4.0026, total: 12},
];

@Component({
  selector: 'app-new-order',
  templateUrl: './new-order.component.html',
  styleUrls: ['./new-order.component.scss']
})
export class NewOrderComponent implements OnInit {
  step = 0;
  rating;
  constructor() { }

  customOptions: OwlOptions = {
    loop: false,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    autoplay:false,
    dots: false,
    navSpeed: 700,
    nav: true,
    navText: ['<img src="assets/images/return.svg">', '<img src="assets/images/next.svg">'],
    responsive: {
      0: {
        items: 2
      },
      400: {
        items: 2
      },
      760: {
        items: 3
      },
      990: {
        items: 4
      },
      1200: {
        items: 5
      }
    },
    
  }

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

