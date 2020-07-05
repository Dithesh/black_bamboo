import { Component, OnInit, ViewChild } from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { DataService } from 'src/app/shared/services/data.service';
import { ActivatedRoute, Router } from '@angular/router';

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
  

  displayedColumns: string[] = ['product', 'quantity', 'price', 'total'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  @ViewChild(MatSort, {static: true}) sort: MatSort;


  step = 1;
  rating;
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

  form:FormGroup;
  orderTypeList:any[] = [];
  selectedOrderType: any;
  tableList: any[];
  orderId;

  constructor(
    private fb: FormBuilder,
    private _serv: DataService,
    private route: ActivatedRoute,
    private router: Router
  ) { 
    this.form = this.fb.group({
      id: [''],
      branch_id: [''],
      orderTypeId: [''],
      relatedInfo: [''],
      customerName: [''],
      mobileNumber: [''],
      cgst: [''],
      sgst: [''],
      igst: [''],
      orderAmount: [''],
      packingCharge: [''],
      extraCharge: [''],
      deliverCharge: [''],
      orderStatus: [''],
      tables: this.fb.array([]),
      items: this.fb.array([]),
    })
  }
 

  ngOnInit() {
    this.dataSource.sort = this.sort;
    this.getOrderTypes();
  }

  getOrderTypes() {
    this._serv.endpoint = "order-manager/order-type?status=active";
    this._serv.get().subscribe(response => {
      this.orderTypeList = response as any[];
      if(this.orderTypeList.length > 0){
        this.form.get('orderTypeId').setValue(this.orderTypeList[0].id)
        this.onChangeOrderType(this.orderTypeList[0])
      }
    })
  }

  onChangeOrderType(orderType) {
    this.selectedOrderType = orderType;
    if(this.selectedOrderType.enableTables) {
      this.getTableInfo();
    }
  }

  get tables() {
    return this.form.get('tables') as FormArray;
  }

  getTableInfo() {
    this._serv.endpoint = "order-manager/tables?orderTypeId="+this.selectedOrderType.id;
    this._serv.get().subscribe(response => {
      this.tableList = response as any[];
      this.tables.controls=[];
      this.tableList.forEach(t => {
        let chairs = [];
        let selectedChairs = t.selectedChairs.split(",").filter(x => x!="");
        let orderSelectedChairs = t.orderSelectedChairs.split(",").filter(x => x!="");
        t.chairs.forEach(elem => {
          if(elem != "") {
            let permission = "full";
            if(selectedChairs.indexOf(parseInt(elem)) >= 0) permission="blocked";
            if(orderSelectedChairs.indexOf(parseInt(elem)) >= 0) permission="full";

            chairs.push(this.fb.group( {
              chairId: [elem],
              permission: [permission],
              isSelected: [(permission=='full')?false:true]
            }))
          }
        })

        this.tables.push(this.fb.group({
          id: [t.id],
          tableId: [t.tableId],
          noOfChair: [t.noOfChair],
          isReserved: [t.isReserved],
          chairs: this.fb.array(chairs)
        }))
        
      })
      console.log(this.tables.value);
    })
  }

  selectAllChairs(table) {
    (table.get('chairs') as FormArray).controls.forEach(elem => {
      if(elem.get('permission').value == 'full') {
        elem.get('isSelected').setValue(true);
      }
    })
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
}

