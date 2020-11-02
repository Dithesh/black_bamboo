import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
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

@Component({
  selector: 'app-new-order',
  templateUrl: './new-order.component.html',
  styleUrls: ['./new-order.component.scss']
})
export class NewOrderComponent implements OnInit, OnDestroy {
  


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
  branchList: any[];
  blockForms: boolean;
  userData: any;
  url = environment.imgUrl;
  orderData: any;
  branchDetail: any;
  keyListener = this.shortCutKeyHandler.bind(this);

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
      orderType: [''],
      taxDisabled: [false],
      taxPercent: [0],
      tables: this.fb.array([]),
      items: this.fb.array([]),
    })
  }
 

  ngOnInit() {
    this.userData = this._serv.getUserData();
    if(this.orderId) {
      this.getOrderDetail();
    }else {
      if(this.userData.roles != 'Super Admin') {
        this.form.get('branch_id').setValue(this.userData.branch_id);
        this.getBranchDetail(this.userData.branch_id);
      }
    }
    if(this.userData.roles == 'Super Admin') {
      this.getAllBranches();
    }
    this.getTableInfo();

    window.addEventListener('keydown', this.keyListener, true);
  }
  addOrderItem() {
    return this.fb.group({
      id: [''],
      productId: [''],
      productName: [''],
      isParcel: [''],
      price: ['0.00'],
      quantity: ['1'],
      servedItems: ['0'],
      productionAcceptedQuantity: ['0'],
      productionReadyQuantity: ['0'],
      productionRejectedQuantity: ['0'],
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
          if(control.get('isParcel').value == response.isParcel) {
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
            isParcel: response.isParcel,
            price: item.price,
            packagingCharges: (response.isParcel)?item.packagingCharges:'0'
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
    let packagingCharges = (itemValue.packagingCharges && itemValue.isParcel)?parseFloat(itemValue.packagingCharges):0;
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
    
    let tax = grandTotal * this.form.get('taxPercent').value / 100,
    cgst=0,
    sgst=0;
    if(this.form.get('taxDisabled').value) {
      tax=0;
    }else if(tax > 0) {
      cgst = tax/2;
      sgst = tax/2;
    }
    grandTotal += tax;
    this.form.patchValue({
      orderItemTotal: totalPrice,
      orderAmount: grandTotal,
      packingCharge: '',
      extraCharge: '',
      cgst: cgst,
      sgst: sgst,
      igst: '',
    })
  }

  
  manageTables() {
    
    let dialogRef = this.dialog.open(TableSelectionComponent, {
      width: '1200px',
      data: {
        tables: this.tables,
        blockForm: this.blockForms
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
        this.getBranchDetail(this.branchList[0].id);
        this.form.get('branch_id').valueChanges.subscribe(value => {
          this.getBranchDetail(value);
        })
      }
    })
  }

  getOrderDetail() {
    this._serv.endpoint = "order-manager/order/"+this.orderId;
    this._serv.get().subscribe((response: any) => {
      this.orderData=response;
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
        orderType: response.orderType,
        taxDisabled: response.taxDisabled,
        taxPercent: response.taxPercent,
      });

      if(response.orderStatus == 'completed' || response.orderStatus == 'cancelled' || response.rejectedCount > 0) {
        this.blockForms = true;
        this.form.disable();
      }else {
        this.blockForms = false;
        this.form.enable();
      }

      this.items.controls = [];
      this.items.reset();
      response.order_items.forEach(item => {
        let orderItem = this.addOrderItem();
        if(this.blockForms == true)orderItem.disable();
        orderItem.patchValue({
          id: item.id,
          productId: item.product.id,
          productName: item.product.productName,
          isParcel: item.isParcel,
          price: item.price,
          quantity: item.quantity,
          servedItems: item.servedQuantity,
          productionAcceptedQuantity: item.productionAcceptedQuantity,
          productionReadyQuantity: item.productionReadyQuantity,
          productionRejectedQuantity: item.productionRejectedQuantity,
          packagingCharges: item.packagingCharges,
          totalPrice: item.totalPrice,
          featuredImage: item.product.featuredImage,
          deletedFlag: false
        });
        this.items.push(orderItem);
        this.getOrderItemTotal(orderItem);
      })
      this.getBranchDetail(response.branch_id);
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

    if(this.selectedOrderType.tableRequired) {
      orderData.tables = orderData.tables.map((table:any) => {
        return {
          ...table,
          chairs: table.chairs.filter(chair => (chair.isSelected && chair.permission == 'full')).map(chair => chair.chairId).join(',')
        }
      }).filter(table => table.chairs != "");
    }else {
      orderData.tables=[];
    }
    

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
    this._serv.endpoint="order-manager/order";
    this._serv.post(orderData).subscribe((response:any) => {
      this._serv.showMessage("Order saved successfully", 'success');

      if(orderData.orderStatus == "completed") {
        this.printOrder(orderData);
        this.orderId = response.id;
        this.getOrderDetail();
      }else {
        this.router.navigateByUrl('/admin/order');
      }
    }, ({error}) => {
      console.log(error);
      
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

  getBranchDetail(branch_id) {
    if(!this._serv.notNull(branch_id)){
      this.orderTypeList=[];
      return;
    }
    
    this._serv.endpoint="order-manager/branch/"+branch_id;
    this._serv.get().subscribe((response:any) => {
      this.branchDetail = response;
      
      if(this.branchDetail && this.branchDetail.taxPercent && !this._serv.notNull(this.orderId)) {
        this.form.get('taxPercent').setValue(this.branchDetail.taxPercent);
      }
      this.handleFinalPricing();
      this.orderTypeList = response.order_types as any[];
      if(!this._serv.notNull(this.orderId) && this.orderTypeList.filter.length > 0) {
        this.changeOrderType(this.orderTypeList[0].id);
      }else {
        this.changeOrderType(this.form.get('orderType').value)
      }
    })
  }

  changeOrderType(orderTypeId, from='funtion') {
    if(this.blockForms && from=='button')return;
    this.orderTypeList.forEach(elem => {
      if(elem.id == orderTypeId) {
        this.selectedOrderType = elem;
        this.form.get('orderType').setValue(orderTypeId)
      }
    })
  }

  handleRejectedItems(item) {
    
    this._serv.endpoint = "order-manager/order/rejected-item-remove";
    this._serv.post({id: item.value.id}).subscribe(response => {
      
      this._serv.showMessage("Rejected items removed successfully", 'success');

      this.getOrderDetail();
      this.getTableInfo();
    }, ({error}) => {
      this._serv.showMessage(error['msg'], 'error');
    })
  }

  ngOnDestroy() {
    
    window.removeEventListener('keydown', this.keyListener, true);
  }


  shortCutKeyHandler(e) {
    if (e.ctrlKey && e.which == 68) {
        e.preventDefault();
        this.form.get('taxDisabled').setValue(!this.form.get('taxDisabled').value);
        this.handleFinalPricing();
    }else if (e.ctrlKey && e.which == 83) {
      e.preventDefault();
      this.saveOrder('confirm');
    }
  }


}

