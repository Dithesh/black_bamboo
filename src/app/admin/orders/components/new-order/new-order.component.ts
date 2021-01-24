import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { FormGroup, FormBuilder, FormArray, AbstractControl, FormControl } from '@angular/forms';
import { DataService } from 'src/app/shared/services/data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { PrintOrderInvoiceComponent } from '../print-order-invoice/print-order-invoice.component';
import { AddOrderItemComponent } from '../add-order-item/add-order-item.component';
import { environment } from 'src/environments/environment';
import { TableSelectionComponent } from '../table-selection/table-selection.component';
import { ServeOrderItemComponent } from '../serve-order-item/serve-order-item.component';
import { ConfirmPopupComponent } from 'src/app/shared/components/confirm-popup/confirm-popup.component';
import { debounceTime, map, startWith } from 'rxjs/operators';
import { PrintKotComponent } from '../print-kot/print-kot.component';

@Component({
  selector: 'app-new-order',
  templateUrl: './new-order.component.html',
  styleUrls: ['./new-order.component.scss']
})
export class NewOrderComponent implements OnInit, OnDestroy {
  

  calAmount = new FormControl('');
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  step = 1;
  rating;
  orderProcessing = false;
  selectedCategory='all';
  companyDetails;
  
  form:FormGroup;
  orderTypeList:any[] = [];
  selectedOrderType: any;
  paymentMethodList:any[] = [];
  tableList: any[];
  orderId;
  productList: any[] = [];
  filteredProductList: Observable<any[]>;
  searchProductControl = new FormControl('');
  branchList: any[];
  blockForms: boolean;
  userData: any;
  url = environment.imgUrl;
  orderData: any;
  branchDetail: any;
  orderDetails: any;
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
      customerAddress:[''],
      customerName: [''],
      mobileNumber: [''],
      cgst: [''],
      sgst: [''],
      igst: [''],
      orderItemTotal: [''],
      discountReason: [''],
      discountValue: [''],
      orderAmount: [''],
      packingCharge: [''],
      deliverCharge: [''],
      orderStatus: ['new'],
      orderType: [''],
      taxDisabled: [false],
      taxPercent: [0],
      isPaid:[false],
      paymentMethod: [''],
      tables: this.fb.array([]),
      items: this.fb.array([]),
    })
  }
 

  ngOnInit() {
    this.userData = this._serv.getUserData();
    
    if(this.userData.company_id){
      this.getCompanyDetails(this.userData.company_id);
    }
    if(this.userData.roles == 'Super Admin' || this.userData.roles == 'Company Admin' || this.userData.roles == 'Company Accountant') {
      this.blockForms=true;
      this.form.disable();
      
    }
    if(this.orderId) {
      this.getOrderDetail();
    }else {
      if(this.userData.roles != 'Super Admin' && this.userData.roles != 'Company Admin' && this.userData.roles != 'Company Accountant') {
        this.form.get('branch_id').setValue(this.userData.branch_id);
        this.getBranchDetail(this.userData.branch_id);
        
      }
    }
    // if(this.userData.roles == 'Super Admin') {
    //   this.getAllBranches();
    // }
    this.getTableInfo();
    this.getAllProducts();

    window.addEventListener('keydown', this.keyListener, true);
  }

  getCompanyDetails(id){
      this._serv.endpoint = "order-manager/company/"+id;
      this._serv.get().subscribe((data:any) => {
        this.companyDetails = data;
      })
  }


  _filterProductList(value) {
    value = value?value:"";
    value = value.toLowerCase();
    // alert(1)
    console.log(this.productList, value);
    let productList = [...this.productList]
    // return [];
    let list = []
    productList.forEach(x => {
      let item = {...x};
      item.products = item.products.filter(y => 
        (
          y.productName.toLowerCase().includes(value)
        ));
        list.push(item);
    })
    console.log(list);
    return list;
  }

  onAddItem(element, item) {
        let quantity = parseInt((item.quantity)?item.quantity:1);
        let form:FormGroup = this.addOrderItem();
        let isNew=true;
        if(!this.selectedOrderType.tableRequired) {
          item.isParcel = true;
        }
        this.items.controls.forEach((control:FormGroup) => {
          item.advancedPriceId = this._serv.notNull(item.advancedPriceId)?item.advancedPriceId:null;
          let controlAdvancedPrice = this._serv.notNull(control.get('advancedPriceId').value)?control.get('advancedPriceId').value:"";
          let existingItemPrice = this._serv.notNull(item.advancedPriceId)?item.advancedPriceId:"";

            if(!control.get('deletedFlag').value && control.get('productId').value == item.id && control.get('isParcel').value == item.isParcel && controlAdvancedPrice == existingItemPrice) {
                quantity+=parseInt(control.get('quantity').value)
                form = control;
                isNew=false;
            }
        })
        form.patchValue({
            productId: item.id,
            productName: item.productName,
            featuredImage: item.featuredImage,
            isParcel: item.isParcel,
            price: item.price,
            advancedPriceId: item.advancedPriceId,
            advancedPriceTitle: item.advancedPriceTitle,
            quantity: quantity,
            packagingCharges: (item.isParcel)?item.packagingCharges:'0'
        })
        if(isNew) {
          this.items.push(form);
        }
        this.getOrderItemTotal(form);
        element.checked = false;
        item.quantity = 1;
        item.isParcel = false;
  }




  addOrderItem() {
    return this.fb.group({
      id: [''],
      productId: [''],
      productName: [''],
      isParcel: [''],
      price: ['0.00'],
      advancedPriceId: [''],
      advancedPriceTitle: [''],
      quantity: ['1'],
      servedItems: ['0'],
      productionAcceptedQuantity: ['0'],
      productionReadyQuantity: ['0'],
      productionRejectedQuantity: ['0'],
      packagingCharges: ['0.00'],
      totalPrice: ['0.00'],
      featuredImage: [''],
      orderGroup: [''],
      deletedFlag: [false]
    })
  }

  get items() {
    return this.form.get('items') as FormArray;
  }

  getAllProducts() {
    this._serv.endpoint="order-manager/product/category-based-product";
    this._serv.get().subscribe(response => {
      this.productList = (response as any[]).map(item => {
        item.products = item.products.map(product => {
          let advancedPriceId = "", advancedPriceTitle="", price = product.price;

          if(product.isAdvancedPricing && product.advanced_pricing.length > 0) {
            advancedPriceId = product.advanced_pricing[0].id;
            advancedPriceTitle = product.advanced_pricing[0].title;
            price = product.advanced_pricing[0].price;
          }
          return {
            ...product,
            isParcel: false,
            quantity: 1,
            price: price,
            advancedPriceId: advancedPriceId,
            advancedPriceTitle: advancedPriceTitle,
          }
        })
        return item;
      });
      // this.filteredProductList = of(this.productList);
      
    this.filteredProductList = this.searchProductControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterProductList(value))
    );
      console.log(this.productList);
      
    })
  }

  handleProductPriceChange(item) {
    item.advanced_pricing.forEach(elem => {
      if(elem.id == item.advancedPriceId) {
        item.price = elem.price;
        item.advancedPriceTitle = elem.title;
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

    let discountValue = parseFloat(this.form.get('discountValue').value);
    if(!isNaN(discountValue) && discountValue > 0) {
      grandTotal = grandTotal - discountValue;
    }

    this.form.patchValue({
      orderItemTotal: totalPrice,
      orderAmount: grandTotal,
      packingCharge: '',
      cgst: cgst,
      sgst: sgst,
      igst: '',
    })
  }


  serveOrderItem() {
    let dialogRef = this.dialog.open(ServeOrderItemComponent, {
      width: '500px',
      autoFocus:false,
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
      if(Array.isArray(this.tableList)) {
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
        customerAddress: response.customerAddress,
        customerName: (response.customer)?response.customer.customerName:"",
        mobileNumber: (response.customer)?response.customer.mobileNumber:"",
        cgst: response.cgst,
        sgst: response.sgst,
        orderItemTotal: response.orderItemTotal,
        orderAmount: response.orderAmount,
        packingCharge: response.packingCharge,
        deliverCharge: response.deliverCharge,
        discountValue: response.discountValue,
        discountReason: response.discountReason,
        orderStatus: response.orderStatus,
        orderType: response.orderType,
        taxDisabled: response.taxDisabled,
        taxPercent: response.taxPercent,
        paymentMethod: response.paymentMethod
      });

      if(response.orderStatus == 'completed' || response.orderStatus == 'cancelled' || response.rejectedCount > 0 || this.userData.roles == 'Super Admin' || this.userData.roles == 'Company Admin' || this.userData.roles == 'Company Accountant') {
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
          advancedPriceId: item.advancedPriceId,
          advancedPriceTitle: item.advancedPriceTitle,
          quantity: item.quantity,
          servedItems: item.servedQuantity,
          productionAcceptedQuantity: item.productionAcceptedQuantity,
          productionReadyQuantity: item.productionReadyQuantity,
          productionRejectedQuantity: item.productionRejectedQuantity,
          packagingCharges: item.packagingCharges,
          totalPrice: item.totalPrice,
          featuredImage: item.product.featuredImage,
          orderGroup: item.orderGroup,
          deletedFlag: false
        });
        // console.log('pussing');
        
        this.items.push(orderItem);
        this.getOrderItemTotal(orderItem);
      })
      this.getBranchDetail(response.branch_id);
      this.handleFinalPricing();
    })
  }

  handleOrderQuantityInput(item, type) {
    let current = item.quantity;
    if(type == 'next') {
      current++;
    }else if(type == 'prev') {
      current--;
    }

    if(current <= 0) {
      current=1;
    }
    item.quantity=current;
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
      message = "Data will be freezed after completion. Are you sure want to proceed?";
    }else if(type == 'cancel') {
      orderData.orderStatus = "cancelled";
      message = "Data will be freezed after cancelling. Are you sure want to proceed?";
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
    if(this.orderProcessing) return;
    this.orderProcessing = true;
    this._serv.endpoint="order-manager/order";
    this._serv.post(orderData).subscribe((response:any) => {
      this._serv.showMessage("Order saved successfully", 'success');
      this.orderProcessing = false;
      // if(orderData.orderStatus == "completed") {
      //   this.printOrder(orderData);
      // }
      if(this._serv.notNull(this.orderId)) {
        this.getOrderDetail();
        if(orderData.orderStatus == "completed") {
          this.printOrder(orderData);
        }
      }else {
        this.router.navigateByUrl('/admin/order/update/'+response.id);
      }
        // this.orderId = response.id;
      // }else {
        // this.router.navigateByUrl('/admin/order/update/'+response.id);
      // }
    }, ({error}) => {
      this._serv.showMessage(error['msg'], 'error');
      this.orderProcessing = false;
    })
  }

  printOrder(orderData=null) {
    if(!this._serv.notNull(orderData)) {
      orderData = this.form.getRawValue();

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
    }
    if(!this._serv.notNull(orderData.id)) {
      this._serv.showMessage('Save the order first', 'error');
      return;
    }
    this.dialog.open(PrintOrderInvoiceComponent, {
      data: {
        savedOrderData: this.orderData,
        orderData: orderData,
        branchData: this.branchDetail,
        companyData : this.companyDetails,
        userData : this.userData,
      }
    })
  }

  printAddress(orderData=null) {
    if(!this._serv.notNull(orderData)) {
      orderData = this.form.getRawValue();
    }
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
    if(!this._serv.notNull(orderData.id)) {
      this._serv.showMessage('Save the order first', 'error');
      return;
    }
    this.dialog.open(PrintKotComponent, {
      data: {
        savedOrderData: this.orderData,
        orderData: orderData,
        branchData: this.branchDetail,
        companyData : this.companyDetails,
        userData : this.userData,
      }
    })
  }

  getBranchDetail(branch_id) {
    if(!this._serv.notNull(branch_id)){
      this.orderTypeList=[];
      this.paymentMethodList = [];
      return;
    }
    
    this._serv.endpoint="order-manager/branch/"+branch_id;
    this._serv.get().subscribe((response:any) => {
      this.branchDetail = response;
      
      if(this.branchDetail && this.branchDetail.taxPercent && !this._serv.notNull(this.orderId)) {
        this.form.get('taxPercent').setValue(this.branchDetail.taxPercent);
      }
      this.handleFinalPricing();
      this.paymentMethodList = response.payment_methods as any[];
      
      if(this.branchDetail && this.paymentMethodList && this.paymentMethodList.length > 0 && !this._serv.notNull(this.orderId)) {
        this.form.get('paymentMethod').setValue(this.paymentMethodList[0].id);
      }


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
    if(from == 'button' && this.items.controls.length > 0) {
      let dialogRef = this.dialog.open(ConfirmPopupComponent, {
        data: {
          message: "Changing order type will clear the items. Will you confirm?"
        }
      });
      dialogRef.afterClosed().subscribe(data => {
        if(data) {
          this.processOrderTypeChange(orderTypeId, true);
        }
      })
    }else {
      this.processOrderTypeChange(orderTypeId);
    }
    
  }

  processOrderTypeChange(orderTypeId, isClearRequired=false){
    this.orderTypeList.forEach(elem => {
      if(elem.id == orderTypeId) {
        this.selectedOrderType = elem;
        this.form.get('orderType').setValue(orderTypeId)
        if(isClearRequired) {
          this.items.controls.forEach((elem, index) => {
            if(this._serv.notNull(elem.get('id').value)) {
              elem.get('deletedFlag').setValue(true);
            }else {
              this.items.removeAt(index);
            }
          })
          this.handleFinalPricing();
        }
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

  changeOrderStatusBack(status) {
    this._serv.endpoint = "order-manager/order/change-order-status";
    this._serv.post({id: this.orderId, status: status}).subscribe(response => {
      this.getOrderDetail();
    }, ({error}) => {
      this._serv.showMessage(error['msg'], 'error');
    })
  }


}

