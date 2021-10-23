import {Component, Inject, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {DataService} from '../../../../../shared/services/data.service';
import {MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';
import {ConfirmPopupComponent} from '../../../../../shared/components/confirm-popup/confirm-popup.component';
import {ReplaySubject} from "rxjs";
import {debounceTime} from "rxjs/operators";

@Component({
  selector: 'app-order-update-manager',
  templateUrl: './order-update-manager.component.html',
  styleUrls: ['./order-update-manager.component.scss']
})
export class OrderUpdateManagerComponent implements OnInit {
    blockForms = false;
    isDirty = false;
    orderDetails = null;
    branchDetails: any;
    orderTypeList: any[] = [];
    favoriteMenuList: any[] = [];
    productList: any[] = [];
    productListObserver: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    selectedOrderType: any;
    userData: any;
    searchControl: FormControl = new FormControl('');
    form: FormGroup = this.fb.group({
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
  constructor(
    private fb: FormBuilder,
    protected serv: DataService,
    protected dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) private dialogData
  ) {
    this.userData = this.serv.getUserData();
    this.orderDetails = this.dialogData.orderDetails;
    this.branchDetails = this.dialogData.branchDetails;
    this.orderTypeList = this.branchDetails.order_types as any[];
    this.productList = this.dialogData.productList;
    this.productListObserver.next(this.productList);
    this.favoriteMenuList = this.dialogData.favItemMenu;

    if (this.serv.notNull(this.orderDetails)) {
      this.changeOrderType(this.form.get('orderType').value);
    }else if (this.orderTypeList.filter.length > 0) {
      this.changeOrderType(this.orderTypeList[0].id);
    }
  }

  ngOnInit(): void {

    this.searchControl.valueChanges.pipe(
      debounceTime(300)
    ).subscribe(value => {
      value = value ? value : '';
      value = value.toLowerCase();
      this.productListObserver.next(
        this.productList.map(cat => {
          return {
            ...cat,
            products: cat.products.filter(product => {
              return product.productName.toLowerCase().includes(value) || product.productNumber.toLowerCase().includes(value);
            })
          };
        })
      );
    });
  }

  changeOrderType(orderTypeId, from = 'funtion') {
    if (this.blockForms && from === 'button') { return; }
    if (from === 'button' && this.items.controls.length > 0) {
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
      if (elem.id === orderTypeId) {
        this.selectedOrderType = elem;
        this.form.get('orderType').setValue(orderTypeId);
        if (isClearRequired) {
          this.items.controls.forEach((control, index) => {
            if (this.serv.notNull(control.get('id').value)) {
              control.get('deletedFlag').setValue(true);
            } else {
              this.items.removeAt(index);
            }
          });
          this.handleFinalPricing();
        }
      }
    });
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
    if (charge != null && charge !== '' && charge !== undefined && charge > 0) {
      grandTotal += parseFloat(charge);
    }

    let tax = grandTotal * this.form.get('taxPercent').value / 100;
    let cgst = 0;
    let sgst = 0;
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


  handleOrderDetails() {

      this.form.patchValue({
        id: this.orderDetails.id,
        branch_id: this.orderDetails.branch_id,
        relatedInfo: this.orderDetails.relatedInfo,
        customerAddress: this.orderDetails.customerAddress,
        customerName: (this.orderDetails.customer) ? this.orderDetails.customer.customerName : '',
        mobileNumber: (this.orderDetails.customer) ? this.orderDetails.customer.mobileNumber : '',
        cgst: this.orderDetails.cgst,
        sgst: this.orderDetails.sgst,
        orderItemTotal: this.orderDetails.orderItemTotal,
        orderAmount: this.orderDetails.orderAmount,
        packingCharge: this.orderDetails.packingCharge,
        deliverCharge: this.orderDetails.deliverCharge,
        discountValue: this.orderDetails.discountValue,
        isPaid: this.orderDetails.isPaid,
        discountReason: this.orderDetails.discountReason,
        orderStatus: this.orderDetails.orderStatus,
        orderType: this.orderDetails.orderType,
        taxDisabled: this.orderDetails.taxDisabled,
        taxPercent: this.orderDetails.taxPercent,
        paymentMethod: this.orderDetails.paymentMethod
      });

      if (
        this.orderDetails.orderStatus === 'completed' ||
        this.orderDetails.orderStatus === 'cancelled' ||
        this.orderDetails.rejectedCount > 0 ||
        this.userData.roles === 'Super Admin' ||
        this.userData.roles === 'Company Admin'
      ) {
        this.blockForms = true;
        this.form.disable();
      } else {
        this.blockForms = false;
        this.form.enable();
      }

      this.items.controls = [];
      this.items.reset();
      this.orderDetails.order_items.forEach(item => {

        const orderItem = this.addOrderItem();
        if (this.blockForms === true) { orderItem.disable(); }
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
      this.orderDetails.order_item_combos.forEach(item => {

        const comboItem = this.addOrderItemCombo();
        if (this.blockForms === true) { comboItem.disable(); }
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
      this.handleFinalPricing();
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


}
