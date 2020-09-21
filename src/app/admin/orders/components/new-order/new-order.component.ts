import { Component, OnInit, ViewChild } from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { FormGroup, FormBuilder, FormArray, AbstractControl, FormControl } from '@angular/forms';
import { DataService } from 'src/app/shared/services/data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { PrintOrderInvoiceComponent } from '../print-order-invoice/print-order-invoice.component';
import { AddOrderItemComponent } from '../add-order-item/add-order-item.component';
import { environment } from 'src/environments/environment';
import { TableSelectionComponent } from '../table-selection/table-selection.component';
import { ServeOrderItemComponent } from '../serve-order-item/serve-order-item.component';
import { ConfirmPopupComponent } from 'src/app/shared/components/confirm-popup/confirm-popup.component';

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


  step = 1;
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
  userData: any;
  url = environment.domain;

  constructor(
    private fb: FormBuilder,
    private _serv: DataService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog
  ) { 
    this.orderId = this.route.snapshot.params.id;
    this.form = this.fb.group({
      id: [''],
      branch_id: [''],
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
    this.userData = this._serv.getUserData();
    this.getAllBranches();
    if(this.orderId) {
      this.getOrderDetail();
    } 
    this.getTableInfo();
  }

  addOrderItem() {
    return this.fb.group({
      id: [''],
      productId: [''],
      productName: [''],
      orderType: [''],
      price: ['0.00'],
      quantity: ['1'],
      servedItems: ['0'],
      packagingCharges: ['0.00'],
      totalPrice: ['0.00'],
      featuredImage: [''],
      deletedFlag: [false]
    })
  }

  get items() {
    return this.form.get('items') as FormArray;
  }

  addNewOrderItem() {
    if(this.blockForms)return;
    let dialogRef = this.dialog.open(AddOrderItemComponent, {
      width: '500px',
      autoFocus: false,
      data: {
        orderItems: this.items.value
      }
    });

    dialogRef.afterClosed().subscribe(response => {
      if(response) {
        let removeElement=[];
        this.items.controls.forEach(control => {
          if(control.get('orderType').value == response.orderType) {
            response.items.forEach((elem, index) => {
              if(control.get('productId').value == elem.id) {
                removeElement.unshift(index);
              }
            })
          }
        })
        removeElement.sort(function(a, b){return b-a}); //sort indexes
        removeElement.forEach(index => {
          response.items.splice(index, 1);
        })
        response.items.forEach(item => {
          let form = this.addOrderItem();
          form.patchValue({
            productId: item.id,
            productName: item.productName,
            featuredImage: item.featuredImage,
            orderType: response.orderType,
            price: item.price,
            packagingCharges: (response.orderType != 'on-table')?item.packagingCharges:'0'
          })
          this.items.push(form);
          this.getOrderItemTotal(form);
        })
      }
    })
  }

  getOrderItemTotal(orderItem) {
    let itemValue = orderItem.value;
    let price = (itemValue.price)?parseFloat(itemValue.price):0;
    let quantity = (itemValue.quantity)?parseFloat(itemValue.quantity):0;
    let packagingCharges = (itemValue.packagingCharges && itemValue.orderType != 'on-table')?parseFloat(itemValue.packagingCharges):0;
    orderItem.get('totalPrice').setValue((price * quantity) + (packagingCharges * quantity));
    this.handleFinalPricing();
  }

  handleFinalPricing() {
    let orderItems = this.items.value;
    let totalPrice = 0;
    let grandTotal = 0;
    orderItems.forEach(item => {
      if(!item.deletedFlag) {
        totalPrice = totalPrice + parseFloat(item.totalPrice);
      }
    })
    grandTotal+=totalPrice;
    let charge = this.form.get('deliverCharge').value;
    if(charge!=null && charge != '' && charge != undefined && charge > 0){
      grandTotal += parseFloat(charge);
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

  
  manageTables() {
    if(this.blockForms)return;
    let dialogRef = this.dialog.open(TableSelectionComponent, {
      width: '1200px',
      data: {
        tables: this.tables
      }
    });

    dialogRef.afterClosed().subscribe(response => {
      if(response){
        this.tables.controls=[];
        this.tables.reset();
        response.controls.forEach(control => {
          this.tables.push(control);
        })
      }
    })
  }

  serveOrderItem() {
    let dialogRef = this.dialog.open(ServeOrderItemComponent, {
      width: '500px',
      data: {
        form: this.items
      }
    })
  }

  


  get tables() {
    return this.form.get('tables') as FormArray;
  } 

  getTableInfo() {
    this._serv.endpoint = "order-manager/tables?orderId="+this.orderId;
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

  

  getAllBranches() {
    this._serv.endpoint = "order-manager/branch?fields=id,branchTitle";
    this._serv.get().subscribe(response => {
      this.branchList = response as any[];
      if(this.orderId == undefined && this.branchList.length > 0) {
        this.form.get('branch_id').setValue(this.branchList[0].id);
      }
    })
  }

  getOrderDetail() {
    this._serv.endpoint = "order-manager/order/"+this.orderId;
    this._serv.get().subscribe((response: any) => {
      this.form.patchValue({
        id: response.id,
        branch_id: response.branch_id,
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
        orderItem.patchValue({
          id: item.id,
          productId: item.product.id,
          productName: item.product.productName,
          orderType: item.orderType,
          price: item.price,
          quantity: item.quantity,
          servedItems: item.servedQuantity,
          packagingCharges: item.packagingCharges,
          totalPrice: item.totalPrice,
          featuredImage: item.product.featuredImage,
          deletedFlag: false
        });
        this.items.push(orderItem);
      })
      this.dataSource.next(this.items.controls);
      this.handleFinalPricing();
    })
  }

  handleNumberControl(formControl, type, index) {
    if(this.blockForms)return;
    let value = formControl.get('quantity').value;
    let served = parseInt(formControl.get('servedItems').value);
    if(isNaN(value) || value == null || value == undefined || value == "") {
      value = ( served > 1)?served:1;
    };
    if(type == 'next') {
      value++;
    }else if(type == 'prev' && value > 0 && served < value) {
      value--;
    }
    if(value == 0) {
      let dialogRef = this.dialog.open(ConfirmPopupComponent);
      dialogRef.afterClosed().subscribe(data => {
        if(data) {
          if(this._serv.notNull(formControl.get('id').value)) {
            formControl.get('deletedFlag').setValue(true);
          }else {
            this.items.removeAt(index);
          }
          this.getOrderItemTotal(formControl)
        }else {
          formControl.get('quantity').setValue(( served > 1)?served:1, {emitEvent: false})
          this.getOrderItemTotal(formControl)
        }
      })
    }else {
      formControl.get('quantity').setValue(value, {emitEvent: true});
      this.getOrderItemTotal(formControl)
    }
  }

  saveOrder(type = "confirm") {
    let orderData = {...this.form.value};

    
    orderData.tables = orderData.tables.map((table:any) => {
      return {
        ...table,
        chairs: table.chairs.filter(chair => (chair.isSelected && chair.permission == 'full')).map(chair => chair.chairId).join(',')
      }
    }).filter(table => table.chairs != "");

    if(orderData.items.length <= 0) {
      this._serv.showMessage('Please add items.', 'error');
      return;
    }
    let message = "";
    if(type == 'confirm') {
      orderData.orderStatus = "new";
      this.updateOrder(orderData);
      return;
    }else if(type == "complete") {
      orderData.orderStatus = "completed";
      message = "Data will be freezed after completion. Are you sure want to procede?";
    }else if(type == 'cancel') {
      orderData.orderStatus = "cancelled";
      message = "Data will be freezed after cancelling. Are you sure want to procede?";
    }

    this.takeConfirmation(orderData, message);
    
  }

  takeConfirmation(orderData, message) {
    let dialogRef = this.dialog.open(ConfirmPopupComponent, {
      data: {
        message: message
      }
    });
    dialogRef.afterClosed().subscribe(data => {
      if(data) {
        this.updateOrder(orderData);
      }
    })
  }

  updateOrder(orderData) {
    let api=null;
    this._serv.endpoint="order-manager/order";
    if(orderData.id == "") {
      api = this._serv.post(orderData);
    }else {
      this._serv.endpoint+="/"+orderData.id;
      api = this._serv.put(orderData);
    }
    api.subscribe(response => {
      this._serv.showMessage("Order saved successfully", 'success');

      if(orderData.orderStatus == "completed") {
        this.printOrder(orderData);
        this.orderId = response.id;
        this.getOrderDetail();
      }else {
        this.router.navigateByUrl('/admin/order');
      }
    }, ({error}) => {
      this._serv.showMessage(error['msg'], 'error');
    })
  }

  printOrder(orderData=null) {
    if(!this._serv.notNull(orderData)) {
      orderData = this.form.value;
    }
    this.dialog.open(PrintOrderInvoiceComponent, {
      data: {
        orderData: orderData
      }
    })
  }
}

