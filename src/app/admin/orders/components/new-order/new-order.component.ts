import {Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { FormGroup, FormBuilder, FormArray, AbstractControl, FormControl } from '@angular/forms';
import { DataService } from 'src/app/shared/services/data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import {MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';
import { PrintOrderInvoiceComponent } from '../print-order-invoice/print-order-invoice.component';
import { AddOrderItemComponent } from '../add-order-item/add-order-item.component';
import { environment } from 'src/environments/environment';
import { TableSelectionComponent } from '../table-selection/table-selection.component';
import { ServeOrderItemComponent } from '../serve-order-item/serve-order-item.component';
import { ConfirmPopupComponent } from 'src/app/shared/components/confirm-popup/confirm-popup.component';
import { debounceTime, map, startWith } from 'rxjs/operators';
import { PrintKotComponent } from '../print-kot/print-kot.component';
import * as math from 'exact-math';
import {MatTabGroup} from "@angular/material/tabs";

@Component({
  selector: 'app-new-order',
  templateUrl: './new-order.component.html',
  styleUrls: ['./new-order.component.scss']
})
export class NewOrderComponent implements OnInit, OnDestroy {

  isDirty = false;
  isDirtyFormSubscriber;
  calAmount = new FormControl('');
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;
  @ViewChild('searchInput') searchInput: ElementRef;
  step = 1;
  rating;
  orderProcessing = false;
  selectedCategory = 'all';
  companyDetails;

  form: FormGroup;
  orderTypeList: any[] = [];
  selectedOrderType: any;
  paymentMethodList: any[] = [];
  tableList: any[];
  orderId;
  productList: any[] = [];
  filteredProductList: Observable<any[]>;
  comboItemList: any[] = [];
  filteredComboItemList: Observable<any[]>;
  searchProductControl = new FormControl('');
  branchList: any[];
  blockForms: boolean;
  userData: any;
  url = environment.imgUrl;
  orderData: any;
  branchDetail: any;
  orderDetails: any;
  keyListener = this.shortCutKeyHandler.bind(this);
  accessType = 'page';

  constructor(
    protected fb: FormBuilder,
    protected _serv: DataService,
    protected route: ActivatedRoute,
    protected router: Router,
    protected dialog: MatDialog
  ) {
    this.form = this.fb.group({
      id: [''],
      branch_id: [''],
      relatedInfo: [''],
      customerAddress: [''],
      customerName: [''],
      mobileNumber: [''],
      cgst: [''],
      sgst: [''],
      igst: [''],
      orderItemTotal: [''],
      orderComboTotal: [''],
      discountReason: [''],
      discountValue: [''],
      orderAmount: [''],
      packingCharge: [''],
      deliverCharge: [''],
      orderStatus: ['new'],
      orderType: [''],
      taxDisabled: [false],
      taxPercent: [0],
      roundOfAmount: [0],
      isPaid: [false],
      paymentMethod: [''],
      tables: this.fb.array([]),
      items: this.fb.array([]),
      comboItems: this.fb.array([]),
    });
  }


  ngOnInit() {
    if (this.accessType === 'page') {
      this.orderId = this.route.snapshot.params.id;
    }
    this.userData = this._serv.getUserData();
    if (this.userData.company_id) {
      this.getCompanyDetails(this.userData.company_id);
    }
    if (this.userData.roles == 'Super Admin' || this.userData.roles == 'Company Admin' || this.userData.roles == 'Company Accountant') {
      this.blockForms = true;
      this.form.disable();

    }
    if (this.orderId) {
      this.getOrderDetail();
    } else {
      if (this.userData.roles != 'Super Admin' && this.userData.roles != 'Company Admin' && this.userData.roles != 'Company Accountant') {
        this.form.get('branch_id').setValue(this.userData.branch_id);
        this.getBranchDetail(this.userData.branch_id);

      }
    }
    // if(this.userData.roles == 'Super Admin') {
    //   this.getAllBranches();
    // }
    this.getTableInfo();
    this.getAllProducts();
    this.getAllProductItemCombo();

    window.addEventListener('keydown', this.keyListener, true);
  }

  getCompanyDetails(id) {
    this._serv.endpoint = 'order-manager/company/' + id;
    this._serv.get().subscribe((data: any) => {
      this.companyDetails = data;
    });
  }


  _filterProductList(value) {
    value = value ? value : '';
    value = value.toLowerCase();
    const productList = [...this.productList];
    // return [];
    const list = [];
    productList.forEach(x => {
      const item = { ...x };
      item.products = item.products.filter(y =>
      (
        y.productName.toLowerCase().includes(value) || y.productNumber.toLowerCase().includes(value)
      ));
      list.push(item);
    });
    return list;
  }


  _filterComboItemList(value) {
    value = value ? value : '';
    value = value.toLowerCase();
    const comboItemList = [...this.comboItemList];
    // return [];
    const list = comboItemList.filter(y =>
      (
        y.comboTitle.toLowerCase().includes(value)
      ));
    return list;
  }

  onAddItem(element, item) {
    this.isDirty = true;
    let quantity = parseInt((item.quantity) ? item.quantity : 1);
    let form: FormGroup = this.addOrderItem();
    let isNew = true;
    if (!this.selectedOrderType.tableRequired) {
      item.isParcel = true;
    }
    this.items.controls.forEach((control: FormGroup) => {
      item.advancedPriceId = this._serv.notNull(item.advancedPriceId) ? item.advancedPriceId : null;
      const controlAdvancedPrice = this._serv.notNull(control.get('advancedPriceId').value) ? control.get('advancedPriceId').value : '';
      const existingItemPrice = this._serv.notNull(item.advancedPriceId) ? item.advancedPriceId : '';

      if (!control.get('deletedFlag').value && control.get('productId').value == item.id && control.get('isParcel').value == item.isParcel && controlAdvancedPrice == existingItemPrice) {
        quantity += parseInt(control.get('quantity').value);
        form = control;
        isNew = false;
      }
    });
    form.patchValue({
      productId: item.id,
      productName: item.productName,
      featuredImage: item.featuredImage,
      isParcel: item.isParcel,
      price: item.price,
      advancedPriceId: item.advancedPriceId,
      advancedPriceTitle: item.advancedPriceTitle,
      quantity,
      packagingCharges: (item.isParcel) ? item.packagingCharges : '0'
    });
    if (isNew) {
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
      kot_pending: ['0'],
      productionRejectedQuantity: ['0'],
      packagingCharges: ['0.00'],
      totalPrice: ['0.00'],
      featuredImage: [''],
      orderGroup: [''],
      deletedFlag: [false]
    });
  }

  get items() {
    return this.form.get('items') as FormArray;
  }

  addOrderItemCombo() {
    return this.fb.group({
      id: [''],
      comboProductId: [''],
      comboTitle: [''],
      isParcel: [''],
      price: ['0.00'],
      quantity: ['1'],
      servedItems: ['0'],
      productionAcceptedQuantity: ['0'],
      productionReadyQuantity: ['0'],
      kot_pending: ['0'],
      productionRejectedQuantity: ['0'],
      packagingCharges: ['0.00'],
      totalPrice: ['0.00'],
      featuredImage: [''],
      orderGroup: [''],
      deletedFlag: [false]
    });
  }

  get comboItems() {
    return this.form.get('comboItems') as FormArray;
  }

  onAddComboItem(element, item) {
    this.isDirty = true;
    let quantity = parseInt((item.quantity) ? item.quantity : 1);
    let form: FormGroup = this.addOrderItemCombo();
    let isNew = true;
    if (!this.selectedOrderType.tableRequired) {
      item.isParcel = true;
    }
    this.comboItems.controls.forEach((control: FormGroup) => {

      if (!control.get('deletedFlag').value && control.get('comboProductId').value == item.id && control.get('isParcel').value == item.isParcel) {
        quantity += parseInt(control.get('quantity').value);
        form = control;
        isNew = false;
      }
    });
    form.patchValue({
      comboProductId: item.id,
      comboTitle: item.comboTitle,
      featuredImage: item.featuredImage,
      isParcel: item.isParcel,
      price: item.comboTotal,
      quantity,
      packagingCharges: (item.isParcel) ? item.packagingCharges : '0'
    });
    if (isNew) {
      this.comboItems.push(form);
    }
    this.getOrderItemComboTotal(form);
    element.checked = false;
    item.quantity = 1;
    item.isParcel = false;
  }



  getAllProducts() {
    this._serv.endpoint = 'order-manager/product/category-based-product';
    this._serv.get().subscribe(response => {
      this.productList = (response as any[]).map(item => {
        item.products = item.products.map(product => {
          let advancedPriceId = '', advancedPriceTitle = '', price = product.price;

          if (product.isAdvancedPricing && product.advanced_pricing.length > 0) {
            advancedPriceId = product.advanced_pricing[0].id;
            advancedPriceTitle = product.advanced_pricing[0].title;
            price = product.advanced_pricing[0].price;
          }
          return {
            ...product,
            isParcel: false,
            quantity: 1,
            price,
            advancedPriceId,
            advancedPriceTitle,
          };
        });
        return item;
      });
      // this.filteredProductList = of(this.productList);

      this.filteredProductList = this.searchProductControl.valueChanges.pipe(
        startWith(''),
        map(value => this._filterProductList(value))
      );

    });
  }


  getAllProductItemCombo() {
    this._serv.endpoint = 'order-manager/product-combo?status=active';
    this._serv.get().subscribe(response => {
      this.comboItemList = (response as any[]).map(item => {
          return {
            ...item,
            isParcel: false,
            quantity: 1
          };
      });
      this.filteredComboItemList = this.searchProductControl.valueChanges.pipe(
        startWith(''),
        map(value => this._filterComboItemList(value))
      );

    });
  }

  handleProductPriceChange(item) {
    item.advanced_pricing.forEach(elem => {
      if (elem.id == item.advancedPriceId) {
        item.price = elem.price;
        item.advancedPriceTitle = elem.title;
      }
    });
  }

  getOrderItemTotal(orderItem) {
    const itemValue = orderItem.value;
    const price = (itemValue.price) ? parseFloat(itemValue.price) : 0;
    const quantity = (itemValue.quantity) ? parseFloat(itemValue.quantity) : 0;
    const packagingCharges = (itemValue.packagingCharges && itemValue.isParcel) ? parseFloat(itemValue.packagingCharges) : 0;
    orderItem.get('totalPrice').setValue((price * quantity) + (packagingCharges * quantity));
    this.handleFinalPricing();
  }

  getOrderItemComboTotal(comboItem) {
    const itemValue = comboItem.value;
    const price = (itemValue.price) ? parseFloat(itemValue.price) : 0;
    const quantity = (itemValue.quantity) ? parseFloat(itemValue.quantity) : 0;
    const packagingCharges = (itemValue.packagingCharges && itemValue.isParcel) ? parseFloat(itemValue.packagingCharges) : 0;
    comboItem.get('totalPrice').setValue((price * quantity) + (packagingCharges * quantity));
    this.handleFinalPricing();
  }
  handleFinalPricing(shouldBeDirty= false) {
    if (shouldBeDirty) {this.isDirty = true; }
    const orderItems = this.items.value;
    let totalPrice = 0;
    let totalComboPrice = 0;
    let grandTotal = 0;
    orderItems.forEach(item => {
      if (!item.deletedFlag) {
        totalPrice = totalPrice + parseFloat(item.totalPrice);
      }
    });
    grandTotal += totalPrice;
    const comboItems = this.comboItems.value;
    comboItems.forEach(item => {
      if (!item.deletedFlag) {
        totalComboPrice = totalComboPrice + parseFloat(item.totalPrice);
      }
    });
    grandTotal += totalComboPrice;
    const charge = this.form.get('deliverCharge').value;
    if (charge != null && charge != '' && charge != undefined && charge > 0) {
      grandTotal += parseFloat(charge);
    }

    let tax = grandTotal * this.form.get('taxPercent').value / 100,
      cgst = 0,
      sgst = 0;
    if (this.form.get('taxDisabled').value) {
      tax = 0;
    } else if (tax > 0) {
      cgst = tax / 2;
      sgst = tax / 2;
    }
    grandTotal += tax;

    const discountValue = parseFloat(this.form.get('discountValue').value);
    if (!isNaN(discountValue) && discountValue > 0) {
      grandTotal = grandTotal - discountValue;
    }

    const [integer, decimal] = grandTotal.toString().split('.');
    grandTotal = parseInt(integer);
    const roundOfAmount = (decimal) ? parseFloat('0.' + decimal) : 0;


    // math;

    this.form.patchValue({
      orderItemTotal: totalPrice,
      orderComboTotal: totalComboPrice,
      orderAmount: grandTotal,
      packingCharge: '',
      roundOfAmount,
      cgst,
      sgst,
      igst: '',
    });
  }


  serveOrderItem() {
    const dialogRef = this.dialog.open(ServeOrderItemComponent, {
      width: '500px',
      autoFocus: false,
      data: {
        form: this.items
      }
    });
  }




  get tables() {
    return this.form.get('tables') as FormArray;
  }

  getTableInfo() {
    this._serv.endpoint = 'order-manager/tables?showActive=true&orderId=' + ((this.orderId) ? this.orderId : '');
    this._serv.get().subscribe(response => {
      const responseData = response as any[];
      this.tableList = [];
      if (responseData.length > 0) {
        this.tableList = responseData[0].tables;
      }
      this.tables.controls = [];
      if (Array.isArray(this.tableList)) {
        this.tableList.forEach(t => {
          const chairs = [];
          const selectedChairs = (t.selectedChairs) ? t.selectedChairs.split(',').filter(x => x != '') : [];
          const orderSelectedChairs = t.orderSelectedChairs ? t.orderSelectedChairs.split(',').filter(x => x != '') : [];
          t.chairs.forEach(elem => {
            if (elem != '') {
              let permission = 'full';
              if (selectedChairs.indexOf(elem.toString()) >= 0) { permission = 'blocked'; }
              if (orderSelectedChairs.indexOf(elem.toString()) >= 0) { permission = 'full'; }
              const group = this.fb.group({
                chairId: [elem],
                permission: [permission],
                isSelected: [(permission == 'full' && orderSelectedChairs.indexOf(elem.toString()) < 0) ? false : true]
              });
              if (this.blockForms) { group.disable(); }
              chairs.push(group);
            }
          });

          this.tables.push(this.fb.group({
            id: [t.id],
            tableId: [t.tableId],
            noOfChair: [t.noOfChair],
            isReserved: [t.isReserved],
            chairs: this.fb.array(chairs)
          }));

        });
      }
    });
  }



  getOrderDetail() {

    this.isDirty = false;
    this._serv.endpoint = 'order-manager/order/' + this.orderId;
    this._serv.get().subscribe((response: any) => {
      this.orderData = response;



      this.form.patchValue({
        id: response.id,
        branch_id: response.branch_id,
        relatedInfo: response.relatedInfo,
        customerAddress: response.customerAddress,
        customerName: (response.customer) ? response.customer.customerName : '',
        mobileNumber: (response.customer) ? response.customer.mobileNumber : '',
        cgst: response.cgst,
        sgst: response.sgst,
        orderItemTotal: response.orderItemTotal,
        orderAmount: response.orderAmount,
        packingCharge: response.packingCharge,
        deliverCharge: response.deliverCharge,
        discountValue: response.discountValue,
        isPaid: response.isPaid,
        discountReason: response.discountReason,
        orderStatus: response.orderStatus,
        orderType: response.orderType,
        taxDisabled: response.taxDisabled,
        taxPercent: response.taxPercent,
        paymentMethod: response.paymentMethod
      });

      if (response.orderStatus == 'completed' || response.orderStatus == 'cancelled' || response.rejectedCount > 0 || this.userData.roles == 'Super Admin' || this.userData.roles == 'Company Admin' || this.userData.roles == 'Company Accountant') {
        this.blockForms = true;
        this.form.disable();
      } else {
        this.blockForms = false;
        this.form.enable();
      }

      this.items.controls = [];
      this.items.reset();
      response.order_items.forEach(item => {

        const orderItem = this.addOrderItem();
        if (this.blockForms == true) { orderItem.disable(); }
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
          kot_pending: item.kot_pending,
          packagingCharges: item.packagingCharges,
          totalPrice: item.totalPrice,
          featuredImage: item.product.featuredImage,
          orderGroup: item.orderGroup,
          deletedFlag: false
        });

        this.items.push(orderItem);
        this.getOrderItemTotal(orderItem);
      });


      this.comboItems.controls = [];
      this.comboItems.reset();
      response.order_item_combos.forEach(item => {

        const comboItem = this.addOrderItemCombo();
        if (this.blockForms == true) { comboItem.disable(); }
        comboItem.patchValue({
          id: item.id,
          comboProductId: item.product_combo.id,
          comboTitle: item.product_combo.comboTitle,
          isParcel: item.isParcel,
          price: item.price,
          quantity: item.quantity,
          servedItems: item.servedQuantity,
          productionAcceptedQuantity: item.productionAcceptedQuantity,
          productionReadyQuantity: item.productionReadyQuantity,
          productionRejectedQuantity: item.productionRejectedQuantity,
          kot_pending: item.kot_pending,
          packagingCharges: item.packagingCharges,
          totalPrice: item.totalPrice,
          featuredImage: item.product_combo.featuredImage,
          deletedFlag: false
        });

        this.comboItems.push(comboItem);
        this.getOrderItemComboTotal(comboItem);
      });

      this.getBranchDetail(response.branch_id);
      this.handleFinalPricing();
    });
  }

  handleOrderQuantityInput(item, type) {
    let current = item.quantity;
    if (type == 'next') {
      current++;
    } else if (type == 'prev') {
      current--;
    }

    if (current <= 0) {
      current = 1;
    }
    item.quantity = current;
  }

  handleNumberControl(formControl, type, index, module= 'items') {
    if (this.blockForms) { return; }
    let value = formControl.get('quantity').value;
    const served = parseInt(formControl.get('servedItems').value);
    if (isNaN(value) || value == null || value == undefined || value == '') {
      value = (served > 1) ? served : 1;
    }
    if (type == 'next') {
      value++;
    } else if (type == 'prev' && value > 0 && served < value) {
      value--;
    }
    if (value == 0) {
      const dialogRef = this.dialog.open(ConfirmPopupComponent);
      dialogRef.afterClosed().subscribe(data => {
        if (data) {
          this.isDirty = true;
          if (this._serv.notNull(formControl.get('id').value)) {
            formControl.get('deletedFlag').setValue(true);
          } else {

            if (module === 'items') {
              this.items.removeAt(index);
            }else {
              this.comboItems.removeAt(index);
            }
          }
        } else {
          this.isDirty = true;
          formControl.get('quantity').setValue((served > 1) ? served : 1, { emitEvent: false });
        }
        if (module === 'items') {
          this.getOrderItemTotal(formControl);
        }else {
          this.getOrderItemComboTotal(formControl);
        }
      });
    } else {
      formControl.get('quantity').setValue(value, { emitEvent: true });
      this.isDirty = true;
      if (module === 'items') {
        this.getOrderItemTotal(formControl);
      }else {
        this.getOrderItemComboTotal(formControl);
      }
    }
  }

  saveOrder(type = 'confirm', callback = (type) => {}) {
    const orderData = { ...this.form.value };

    if (this.selectedOrderType.tableRequired) {
      orderData.tables = orderData.tables.map((table: any) => {
        return {
          ...table,
          chairs: table.chairs.filter(chair => (chair.isSelected && chair.permission == 'full')).map(chair => chair.chairId).join(',')
        };
      }).filter(table => table.chairs != '');
    } else {
      orderData.tables = [];
    }


    if (orderData.items.length <= 0 && orderData.comboItems.length <= 0) {
      this._serv.showMessage('Please add items.', 'error');
      return;
    }
    let message = '';
    if (type == 'confirm') {
      orderData.orderStatus = 'new';
      this.updateOrder(orderData, callback);
      return;
    } else if (type == 'complete') {
      orderData.orderStatus = 'completed';
      message = 'Data will be freezed after completion. Are you sure want to proceed?';
    } else if (type == 'cancel') {
      orderData.orderStatus = 'cancelled';
      message = 'Data will be freezed after cancelling. Are you sure want to proceed?';
    } else if (type === 'unsave') {
      return {
        ...orderData,
        selectedOrderType: this.selectedOrderType
      };
    }

    this.takeConfirmation(orderData, message, callback);

  }

  takeConfirmation(orderData, message, callback) {
    const dialogRef = this.dialog.open(ConfirmPopupComponent, {
      data: {
        message
      }
    });
    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        this.updateOrder(orderData, callback);
      }
    });
  }

  updateOrder(orderData, callback) {
    if (this.orderProcessing) { return; }
    this.orderProcessing = true;
    this._serv.endpoint = 'order-manager/order';
    this._serv.post(orderData).subscribe((response: any) => {
      this.isDirty = false;
      this._serv.showMessage('Order saved successfully', 'success');
      this.orderProcessing = false;
      // if(orderData.orderStatus == "completed") {
      //   this.printOrder(orderData);
      // }
      if (this._serv.notNull(this.orderId)) {
        this.getOrderDetail();
        if (orderData.orderStatus === 'completed') {
          this.printOrder(orderData);
        }
        callback('after-save');
      } else {
        if (this.accessType === 'page') {
          this.router.navigateByUrl('/admin/order/update/' + response.id);
        }else {
          callback('after-save');
        }
      }
      // this.orderId = response.id;
      // }else {
      // this.router.navigateByUrl('/admin/order/update/'+response.id);
      // }
    }, ({ error }) => {
      this._serv.showMessage(error.msg, 'error');
      this.orderProcessing = false;
    });
  }

  printOrder(orderData = null) {
    if (!this._serv.notNull(orderData)) {
      orderData = this.form.getRawValue();

      if (this.selectedOrderType.tableRequired) {
        orderData.tables = orderData.tables.map((table: any) => {
          return {
            ...table,
            chairs: table.chairs.filter(chair => (chair.isSelected && chair.permission == 'full')).map(chair => chair.chairId).join(',')
          };
        }).filter(table => table.chairs != '');
      } else {
        orderData.tables = [];
      }
    }
    if (!this._serv.notNull(orderData.id) || this.isDirty) {
      this._serv.showMessage('Save the order first', 'error');
      return;
    }
    this.dialog.open(PrintOrderInvoiceComponent, {
      data: {
        savedOrderData: this.orderData,
        orderData,
        branchData: this.branchDetail,
        companyData: this.companyDetails,
        userData: this.userData,
      }
    });
  }

  printAddress(orderData = null) {
    if (!this._serv.notNull(orderData)) {
      orderData = this.form.getRawValue();
    }
    if (this.selectedOrderType.tableRequired) {
      orderData.tables = orderData.tables.map((table: any) => {
        return {
          ...table,
          chairs: table.chairs.filter(chair => (chair.isSelected && chair.permission == 'full')).map(chair => chair.chairId).join(',')
        };
      }).filter(table => table.chairs != '');
    } else {
      orderData.tables = [];
    }
    if (!this._serv.notNull(orderData.id) || this.isDirty) {
      this._serv.showMessage('Save the order first', 'error');
      return;
    }
    orderData.items = orderData.items.filter(item => item.kot_pending > 0);
    if (orderData.items.length <= 0) {return; }



    const ref = this.dialog.open(PrintKotComponent, {
      data: {
        savedOrderData: this.orderData,
        orderData,
        branchData: this.branchDetail,
        companyData: this.companyDetails,
        userData: this.userData,
      }
    });
    ref.afterClosed().subscribe(response => {
      this._serv.endpoint = 'order-manager/order/kot-print';
      this._serv.post({items: orderData.items}).subscribe(response => {
        this.getOrderDetail();
      });
    });

  }

  getBranchDetail(branch_id) {
    if (!this._serv.notNull(branch_id)) {
      this.orderTypeList = [];
      this.paymentMethodList = [];
      return;
    }

    this._serv.endpoint = 'order-manager/branch/' + branch_id;
    this._serv.get().subscribe((response: any) => {
      this.branchDetail = response;

      if (this.branchDetail && this.branchDetail.taxPercent && !this._serv.notNull(this.orderId)) {
        this.form.get('taxPercent').setValue(this.branchDetail.taxPercent);
      }
      this.handleFinalPricing();
      this.paymentMethodList = response.payment_methods as any[];

      if (this.branchDetail && this.paymentMethodList && this.paymentMethodList.length > 0 && !this._serv.notNull(this.orderId)) {
        this.form.get('paymentMethod').setValue(this.paymentMethodList[0].id);
      }


      this.orderTypeList = response.order_types as any[];
      if (!this._serv.notNull(this.orderId) && this.orderTypeList.filter.length > 0) {
        this.changeOrderType(this.orderTypeList[0].id);
      } else {
        this.changeOrderType(this.form.get('orderType').value);
      }
    });
  }

  changeOrderType(orderTypeId, from = 'funtion') {
    if (this.blockForms && from == 'button') { return; }
    if (from == 'button' && this.items.controls.length > 0) {
      const dialogRef = this.dialog.open(ConfirmPopupComponent, {
        data: {
          message: 'Changing order type will clear the items. Will you confirm?'
        }
      });
      dialogRef.afterClosed().subscribe(data => {
        if (data) {
          this.processOrderTypeChange(orderTypeId, true);
        }
      });
    } else {
      this.processOrderTypeChange(orderTypeId);
    }

  }

  processOrderTypeChange(orderTypeId, isClearRequired = false) {
    this.orderTypeList.forEach(elem => {
      if (elem.id == orderTypeId) {
        this.selectedOrderType = elem;
        this.form.get('orderType').setValue(orderTypeId);
        if (isClearRequired) {
          this.items.controls.forEach((elem, index) => {
            if (this._serv.notNull(elem.get('id').value)) {
              elem.get('deletedFlag').setValue(true);
            } else {
              this.items.removeAt(index);
            }
          });
          this.handleFinalPricing();
        }
      }
    });
  }

  handleRejectedItems(item) {

    this._serv.endpoint = 'order-manager/order/rejected-item-remove';
    this._serv.post({ id: item.value.id }).subscribe(response => {

      this._serv.showMessage('Rejected items removed successfully', 'success');

      this.getOrderDetail();
      this.getTableInfo();
    }, ({ error }) => {
      this._serv.showMessage(error.msg, 'error');
    });
  }

  ngOnDestroy() {

    window.removeEventListener('keydown', this.keyListener, true);
  }


  shortCutKeyHandler(e) {
    if (!this.blockForms) {
      if (e.code === 'F1') {
        e.preventDefault();
        this.searchInput.nativeElement.focus();
      }else if (e.ctrlKey && e.code === 'KeyD') {
        e.preventDefault();
        this.form.get('taxDisabled').setValue(!this.form.get('taxDisabled').value);
        this.handleFinalPricing();
      } else if (e.ctrlKey && e.code === 'KeyS') {
        e.preventDefault();
        this.saveOrder('confirm');
      } else if (e.ctrlKey && e.code === 'KeyQ') {
        e.preventDefault();
        const billIndex = this.selectedOrderType.tableRequired ? 4 : 3;
        if(this.tabGroup.selectedIndex !== billIndex) {
          this.tabGroup.selectedIndex = billIndex;
        }else {
          this.saveOrder('complete');
        }
        // this.saveOrder('complete');
      }
    }
  }

  changeOrderStatusBack(status) {

    const dialogRef = this.dialog.open(ConfirmPopupComponent, {
      data: {
        message: 'Are sure want to reopen?'
      }
    });
    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        this._serv.endpoint = 'order-manager/order/change-order-status';
        this._serv.post({ id: this.orderId, status }).subscribe(response => {
          this.getOrderDetail();
        }, ({ error }) => {
          this._serv.showMessage(error.msg, 'error');
        });
      }
    });
  }


}

