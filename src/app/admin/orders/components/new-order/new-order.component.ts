import { Component, OnInit, ViewChild } from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { FormGroup, FormBuilder, FormArray, AbstractControl, FormControl } from '@angular/forms';
import { DataService } from 'src/app/shared/services/data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

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
  


  @ViewChild(MatSort, {static: true}) sort: MatSort;


  step = 0;
  rating;
  
  // customOptions: OwlOptions = {
  //   loop: false,
  //   mouseDrag: true,
  //   touchDrag: true,
  //   pullDrag: false,
  //   autoplay:false,
  //   dots: false,
  //   navSpeed: 700,
  //   margin:0,
  //   nav: true,
  //   navText: ['<img src="assets/images/return.svg">', '<img src="assets/images/next.svg">'],
  //   responsive: {
  //     0: {
  //       items: 2
  //     },
  //     400: {
  //       items: 2
  //     },
  //     760: {
  //       items: 3
  //     },
  //     990: {
  //       items: 4
  //     },
  //     1200: {
  //       items: 5
  //     }
  //   },
    
  // }

  form:FormGroup;
  orderTypeList:any[] = [];
  selectedOrderType: any;
  tableList: any[];
  orderId;
  productList: any[];
  displayedColumns: string[] = ['product', 'quantity', 'price', 'total'];
  dataSource = new BehaviorSubject<AbstractControl[]>([]);branchList: any[];
  blockForms: boolean;

  constructor(
    private fb: FormBuilder,
    private _serv: DataService,
    private route: ActivatedRoute,
    private router: Router
  ) { 
    this.orderId = this.route.snapshot.params.id;
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
      orderItemTotal: [''],
      orderAmount: [''],
      packingCharge: [''],
      extraCharge: [''],
      deliverCharge: [''],
      orderStatus: ['new'],
      tables: this.fb.array([]),
      items: this.fb.array([]),
    })
  }
 

  ngOnInit() {
    this.getOrderTypes();
    this.getAllProducts();
    if(this.orderId) {
      this.getOrderDetail();
    }else {
      this.items.push(this.addOrderItem());
      this.dataSource.next(this.items.controls);
    }
  }

  getOrderDetail() {
    this._serv.endpoint = "order-manager/order/"+this.orderId;
    this._serv.get().subscribe((response: any) => {
      this.form.patchValue({
        id: response.id,
        branch_id: response.branch_id,
        orderTypeId: response.orderTypeId,
        relatedInfo: response.relatedInfo,
        customerName: (response.customer)?response.customer.customerName:"",
        mobileNumber: (response.customer)?response.customer.mobileNumber:"",
        cgst: response.cgst,
        sgst: response.sgst,
        orderItemTotal: response.orderItemTotal,
        orderAmount: response.orderAmount,
        packingCharge: response.packingCharge,
        deliverCharge: response.deliverCharge,
        orderStatus: response.orderStatus,
      });

      if(response.orderStatus == 'completed' || response.orderStatus == 'cancelled') {
        this.blockForms = true;
        this.form.disable();
      }

      this.items.controls = [];
      response.order_items.forEach(item => {
        let orderItem = this.addOrderItem();
        if(this.blockForms == true)orderItem.disable();
        orderItem.patchValue(item);
        this.items.push(orderItem);
      })
      this.dataSource.next(this.items.controls);
      this.handleFinalPricing();
    })
  }

  addAnotherItem() {
    if(this.blockForms)return;
    let blankRecords =this.items.value.filter(x => x.price == '' || x.quantity == '');
    if(blankRecords.length <= 0) {
      this.items.push(this.addOrderItem());
      this.dataSource.next(this.items.controls);
    }else {
      this._serv.showMessage('Please fill all the data.', 'error')
    }
  }

  addOrderItem() {
    return this.fb.group({
      id: [''],
      productId: [''],
      price: ['0.00'],
      quantity: ['1'],
      packagingCharges: ['0.00'],
      totalPrice: ['0.00'],
    })
  }

  getAllProducts() {
    this._serv.endpoint = "order-manager/product?status=active&needPricing=detailed";
    this._serv.get().subscribe(response => {
      this.productList = response as any[];
    })
  }

  get items() {
    return this.form.get('items') as FormArray;
  }

  onProductChange(event, itemform: FormGroup) {
    
    let itemValue = itemform.value;
    let formArray = this.items.value;
    let count=0;
    formArray.forEach(elem => {
      if(elem.productId == itemValue.productId)
        count++;
    })
    if(count >= 2) {
      this._serv.showMessage("Product already selected", "error");
      itemform.get('productId').setValue("");
      // itemform.get('productId').setErrors({invalid: "Please select product"});
      return;
    }
    this.productList.forEach(elem => {
      if(elem.id == itemValue.productId) {
        
        if(elem.isOrderTypePricing) {
          elem.pricings.forEach(el => {
            if(el.orderTypeId == this.form.get('orderTypeId').value) {
              console.log(el);
              itemform.patchValue({
                price: el.price,
                packagingCharges: el.packagingCharges
              })
            }
          })
        }else {
          itemform.patchValue({
            price: elem.price,
            packagingCharges: elem.packagingCharges
          })
        }
      }
    })
    this.getOrderItemTotal(itemform);
  }

  getOrderItemTotal(orderItem) {
    let itemValue = orderItem.value;
    let price = (itemValue.price)?parseFloat(itemValue.price):0;
    let quantity = (itemValue.quantity)?parseFloat(itemValue.quantity):0;
    let packagingCharges = (itemValue.packagingCharges && this.selectedOrderType.enableExtraCharge)?parseFloat(itemValue.packagingCharges):0;
    orderItem.get('totalPrice').setValue((price * quantity) + (packagingCharges * quantity));
    this.handleFinalPricing();
  }

  handleFinalPricing() {
    let orderItems = this.items.value;
    let totalPrice = 0;
    let grandTotal = 0;
    orderItems.forEach(item => {
      totalPrice = totalPrice + parseFloat(item.totalPrice);
    })
    grandTotal+=totalPrice;
    if(this.selectedOrderType.enableDeliverCharge) {
      let charge = this.form.get('deliverCharge').value;
      if(charge!=null && charge != '' && charge != undefined && charge > 0){
        grandTotal += parseFloat(charge);
      }
    }
    let tax = grandTotal * 0.06;
    grandTotal += tax * 2;
    this.form.patchValue({
      orderItemTotal: totalPrice,
      orderAmount: grandTotal,
      packingCharge: '',
      extraCharge: '',
      cgst: tax,
      sgst: tax,
      igst: '',
    })
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
    if(this.selectedOrderType.enableExtraCharge) {
      this.displayedColumns = ['product', 'quantity', 'price', 'pkg_charge', 'total'];
    }else {
      this.displayedColumns = ['product', 'quantity', 'price', 'total'];
    }
  }

  get tables() {
    return this.form.get('tables') as FormArray;
  }

  getTableInfo() {
    this._serv.endpoint = "order-manager/tables?orderTypeId="+this.selectedOrderType.id+"&orderId="+this.orderId;
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
            if(selectedChairs.indexOf(elem.toString()) >= 0) permission="blocked";
            if(orderSelectedChairs.indexOf(elem.toString()) >= 0) permission="full";
            let group = this.fb.group( {
              chairId: [elem],
              permission: [permission],
              isSelected: [(permission=='full' && orderSelectedChairs.indexOf(elem.toString()) < 0)?false:true]
            });
            if(this.blockForms)group.disable();
            chairs.push(group)
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
    })
  }

  selectAllChairs(table) {
    if(this.blockForms)return;
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

  handleNumberControl(formControl, type) {
    if(this.blockForms)return;
    let value = formControl.get('quantity').value;
    if(value == null || value == undefined || value == "")value=0;
    if(type == 'next') {
      value++;
    }else if(value > 0) {
      value--;
    }
    formControl.get('quantity').setValue(value, {emitEvent: true});
    this.getOrderItemTotal(formControl)
  }

  saveOrder(type = "confirm") {
    let orderData = {...this.form.value};

    if(type == 'confirm') {
      orderData.orderStatus = "new";
    }else if(type == "complete" || type == "complete and print") {
      orderData.orderStatus = "completed";
    }else if(type == 'cancel') {
      orderData.orderStatus = "cancelled";
    }

    orderData.tables = orderData.tables.map((table:any) => {
      return {
        ...table,
        chairs: table.chairs.filter(chair => (chair.isSelected && chair.permission == 'full')).map(chair => chair.chairId).join(',')
      }
    }).filter(table => table.chairs != "")
    console.log(orderData);
    let api=null;
    this._serv.endpoint="order-manager/order";
    if(orderData.id == "") {
      api = this._serv.post(orderData);
    }else {
      this._serv.endpoint+="/"+orderData.id;
      api = this._serv.put(orderData);
    }
    api.subscribe(response => {

    })

  }

  printOrder() {
    
  }
}

