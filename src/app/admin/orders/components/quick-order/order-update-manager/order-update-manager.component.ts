import {Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {DataService} from '../../../../../shared/services/data.service';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {ConfirmPopupComponent} from '../../../../../shared/components/confirm-popup/confirm-popup.component';
import {ReplaySubject} from 'rxjs';
import {debounceTime} from 'rxjs/operators';
import {OrderItemAddComponent} from './order-item-add/order-item-add.component';
import {MatSelectionList} from '@angular/material/list';
import {OrderTableUpdateComponent} from './order-table-update/order-table-update.component';
import {PrintKotComponent} from "../../print-kot/print-kot.component";
import {InvoicePrintingComponent} from "./invoice-printing/invoice-printing.component";
import {CustomerInfoUpdateComponent} from "./customer-info-update/customer-info-update.component";
import {KotPrintingComponent} from "./kot-printing/kot-printing.component";
import * as moment from 'moment';

@Component({
  selector: 'app-order-update-manager',
  templateUrl: './order-update-manager.component.html',
  styleUrls: ['./order-update-manager.component.scss']
})
export class OrderUpdateManagerComponent implements OnInit, OnDestroy {
  @ViewChild('favMenu') favMenu: MatSelectionList;
  @ViewChild('searchInput') searchInput: ElementRef;
  @ViewChild('invoicePrintHolder') invoicePrintHolder: InvoicePrintingComponent;
  @ViewChild('kotPrintHolder') kotPrintHolder: KotPrintingComponent;
  selectedItemTotal = 0;
  hourRotation = 0;
  minuteRotation = 0;
  currentlyPrinting;
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
  subTotal = 0;
  tableList: any[] = [];
  ordertypeControl: FormControl = new FormControl('');
  keyListener = this.shortCutKeyHandler.bind(this);
  orderProcessing = false;
  array = Array;
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
  calAmount: FormControl = new FormControl('');
  selectedTables: any[] = [];
  shortCutBlocked = false;

  constructor(
    private fb: FormBuilder,
    protected serv: DataService,
    protected dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) private dialogData,
    private dialogRef: MatDialogRef<OrderUpdateManagerComponent>
  ) {
    this.userData = this.serv.getUserData();
    this.orderDetails = this.dialogData.orderDetails;
    this.branchDetails = this.dialogData.branchDetails;
    if (this.branchDetails) {
      if (this.branchDetails && this.branchDetails.taxPercent && !this.serv.notNull(this.orderDetails)) {
        this.form.get('taxPercent').setValue(this.branchDetails.taxPercent);
      }

      this.orderTypeList = this.branchDetails.order_types as any[];
    }
    this.productList = this.dialogData.productList;
    this.productListObserver.next(this.productList);
    this.favoriteMenuList = this.dialogData.favItemMenu;

    if (this.dialogData.itemSavedType === 'unsaved') {
      this.changeOrderType(this.dialogData.unsavedData.orderType);
      this.patchPreviousData(this.dialogData.unsavedData);
    } else if (this.serv.notNull(this.orderDetails)) {
      this.handleOrderDetails();
      this.changeOrderType(this.form.get('orderType').value);
      this.getTableInfo();
    } else if (this.orderTypeList.filter.length > 0) {
      this.changeOrderType(this.orderTypeList[0].id);
      this.getTableInfo();
    } else {
      this.getTableInfo();
    }

    if (this.branchDetails && this.branchDetails.payment_methods && this.branchDetails.payment_methods.length > 0 && ((!this.serv.notNull(this.orderDetails)) || (this.serv.notNull(this.orderDetails) && !this.serv.notNull(this.orderDetails.paymentMethod)))) {
      this.form.get('paymentMethod').setValue(this.branchDetails.payment_methods[0].id);
    }
  }

  ngOnInit(): void {
    this.manageClock();
    window.addEventListener('keydown', this.keyListener, true);
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
              return product.name.toLowerCase().includes(value) || product.productNumber.toLowerCase().includes(value);
            })
          };
        })
      );
    });
  }

  patchPreviousData(data) {
    this.form.patchValue(data);

    if (data.orderStatus === 'completed' || data.orderStatus === 'cancelled' || data.rejectedCount > 0 || this.userData.roles === 'Super Admin' || this.userData.roles === 'Company Admin') {
      this.blockForms = true;
      this.form.disable();
    } else {
      this.blockForms = false;
      this.form.enable();
    }

    this.items.controls = [];
    this.items.reset();
    data.items.forEach(item => {

      const orderItem = this.addOrderItem();
      if (this.blockForms === true) {
        orderItem.disable();
      }
      orderItem.patchValue(item);
      this.items.push(orderItem);
      this.getOrderItemTotal(orderItem);
    });


    this.comboItems.controls = [];
    this.comboItems.reset();
    data.comboItems.forEach(item => {

      const comboItem = this.addOrderItemCombo();
      if (this.blockForms === true) {
        comboItem.disable();
      }
      comboItem.patchValue(item);
      this.comboItems.push(comboItem);
      this.getOrderItemComboTotal(comboItem);
    });

    this.handleFinalPricing();
    this.getTableInfo(() => {
      this.tables.controls.forEach(control => {
        data.tables.forEach(elem => {
          if (control.get('id').value === elem.id) {
            (control.get('chairs') as FormArray).controls.forEach(chair => {
              if (elem.chairs.indexOf(chair.get('chairId').value) >= 0) {
                chair.get('isSelected').setValue(true);
              }
            });
          }
        });
        this.seperateTableSelected();
      });
    });
  }


  get tables() {
    return this.form.get('tables') as FormArray;
  }

  getTableInfo(callback = null) {
    this.serv.endpoint = 'order-manager/tables?showActive=true&orderId=' + ((this.orderDetails) ? this.orderDetails.id : '');
    this.serv.get().subscribe(response => {
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
              if (selectedChairs.indexOf(elem.toString()) >= 0) {
                permission = 'blocked';
              }
              if (orderSelectedChairs.indexOf(elem.toString()) >= 0) {
                permission = 'full';
              }
              const group = this.fb.group({
                chairId: [elem],
                permission: [permission],
                isSelected: [(permission === 'full' && orderSelectedChairs.indexOf(elem.toString()) < 0) ? false : true]
              });
              if (this.blockForms) {
                group.disable();
              }
              chairs.push(group);
            }
          });

          this.tables.push(this.fb.group({
            id: [t.id],
            tableId: [t.tableId],
            roomId: [t.room_id],
            roomName: [t.room.roomName],
            noOfChair: [t.noOfChair],
            isReserved: [t.isReserved],
            chairs: this.fb.array(chairs)
          }));

        });
      }
      if (callback != null) {
        callback();
      } else {
        this.seperateTableSelected();
      }
    });
  }

  seperateTableSelected() {
    if (this.selectedOrderType.tableRequired) {
      this.selectedTables = this.tables.getRawValue().map((table: any) => {
        return {
          ...table,
          chairs: table.chairs.filter(chair => (chair.isSelected && chair.permission === 'full')).map(chair => chair.chairId).join(',')
        };
      }).filter(table => table.chairs !== '');
    } else {
      this.selectedTables = [];
    }
  }

  openTableUpdate() {
    const dialogRef = this.dialog.open(
      OrderTableUpdateComponent,
      {
        data: {
          tables: this.tables,
          blockForms: this.blockForms
        },
        width: '800px'
      }
    );
    dialogRef.afterClosed().subscribe(response => {
      if (response) {
        this.isDirty = true;
      }
      this.seperateTableSelected();
    });
  }


  onOrderItemSelected(itemId) {
    let item;
    this.productList.forEach(group => {
      group.products.forEach(product => {
        if (product.uid === itemId) {
          item = product;
        }
      });
    });
    this.searchControl.setValue('');
    this.favMenu.deselectAll();
    this.shortCutBlocked = true;
    const dialogRef = this.dialog.open(OrderItemAddComponent, {
      width: '500px',
      data: {
        item: {...item},
        selectedOrderType: this.selectedOrderType,
      }
    });
    dialogRef.afterClosed().subscribe(response => {
      this.shortCutBlocked = false;
      if (response) {
        const uid = response.uid.split('_');
        if (uid[0] === 'product') {
          this.onAddItem(response);
        } else if (uid[0] === 'combo') {
          this.onAddComboItem(response);
        }
      }
    });

  }


  onAddItem(item) {
    this.isDirty = true;
    let quantity = parseInt((item.quantity) ? item.quantity : 1);
    let form: FormGroup = this.addOrderItem();
    let isNew = true;
    if (!this.selectedOrderType.tableRequired) {
      item.isParcel = true;
    }
    item.advancedPriceId = this.serv.notNull(item.advancedPriceId) ? item.advancedPriceId : '';
    this.items.controls.forEach((control: FormGroup) => {
      const controlAdvancedPrice = this.serv.notNull(control.get('advancedPriceId').value) ? control.get('advancedPriceId').value : '';
      const existingItemPrice = this.serv.notNull(item.advancedPriceId) ? item.advancedPriceId : '';
      if (!control.get('deletedFlag').value && control.get('productId').value === item.id && control.get('isParcel').value === item.isParcel && controlAdvancedPrice === existingItemPrice) {
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
    item.quantity = 1;
    item.isParcel = false;
    if (this.serv.notNull(item.itemDescription)) {
      item.itemDescription  = item.productName + ': ' + item.itemDescription;
    }
    this.addAnotherComment(form, item.itemDescription);
  }

  onAddComboItem(item) {
    this.isDirty = true;
    let quantity = parseInt((item.quantity) ? item.quantity : 1);
    let form: FormGroup = this.addOrderItemCombo();
    let isNew = true;
    if (!this.selectedOrderType.tableRequired) {
      item.isParcel = true;
    }
    this.comboItems.controls.forEach((control: FormGroup) => {

      if (!control.get('deletedFlag').value && control.get('comboProductId').value === item.id && control.get('isParcel').value === item.isParcel) {
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
    console.log(this.form.value);
    if (isNew) {
      this.comboItems.push(form);
    }
    this.getOrderItemComboTotal(form);
    item.quantity = 1;
    item.isParcel = false;
  }

  onKeyboardOrderTypeChange(itd) {
    this.changeOrderType(itd.value, 'button');
  }

  changeOrderType(orderTypeId, from = 'funtion') {
    if (this.blockForms && from === 'button') {
      return;
    }
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

  handleFinalPricing(shouldBeDirty = false) {
    if (shouldBeDirty) {
      this.isDirty = true;
    }
    const orderItems = this.items.value;
    let totalPrice = 0;
    let totalComboPrice = 0;
    let grandTotal = 0;
    this.selectedItemTotal = 0;
    orderItems.forEach(item => {
      if (!item.deletedFlag) {
        this.selectedItemTotal++;
        totalPrice = totalPrice + parseFloat(item.totalPrice);
      }
    });
    grandTotal += totalPrice;
    const comboItems = this.comboItems.value;
    comboItems.forEach(item => {
      if (!item.deletedFlag) {
        this.selectedItemTotal++;
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

    this.subTotal = grandTotal;
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
      deletedFlag: [false],
      comments: this.fb.array([])
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
      quantity: [1],
      servedItems: ['0'],
      productionAcceptedQuantity: ['0'],
      productionReadyQuantity: ['0'],
      kot_pending: ['0'],
      productionRejectedQuantity: ['0'],
      packagingCharges: ['0.00'],
      totalPrice: ['0.00'],
      featuredImage: [''],
      orderGroup: [''],
      deletedFlag: [false],
      comments: this.fb.array([])
    });
  }

  get comboItems() {
    return this.form.get('comboItems') as FormArray;
  }

  addAnotherComment(item, description) {
    if (this.serv.notNull(description)) {
      const formArray = item.get('comments') as FormArray;
      const form = this.addComment();
      form.get('description').setValue(description);
      formArray.push(form);
    }
  }

  deleteComment(item, index) {
      const formArray = item.get('comments') as FormArray;
      if (this.serv.notNull(formArray.controls[index].get('id'))) {
        formArray.controls[index].get('deletedFlag').setValue(true);
      }else {
        formArray.removeAt(index);
      }
  }

  addComment() {
    return this.fb.group({
      id: [''],
      description: [''],
      deletedFlag: [false]
    });
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
      if (this.blockForms === true) {
        orderItem.disable();
      }
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
      if (this.blockForms === true) {
        comboItem.disable();
      }
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


  handleRejectedItems(item, i, type = 'item') {

    this.serv.endpoint = 'order-manager/order/rejected-item-remove';
    this.serv.post({
      id: item.value.id,
      itemType: type
    }).subscribe(response => {

      this.serv.showMessage('Rejected items removed successfully', 'success');
      item.quantity = item.quantity - item.productionRejectedQuantity;
      if (item.quantity <= 0) {
        this.items.removeAt(i);
      }
      this.handleFinalPricing();
    }, ({error}) => {
      this.serv.showMessage(error.msg, 'error');
    });
  }


  handleNumberControl(formControl, type, index, module = 'items') {
    if (this.blockForms) {
      return;
    }
    let value = formControl.get('quantity').value;
    const served = parseInt(formControl.get('servedItems').value);
    if (isNaN(value) || value == null || value == undefined || value == '') {
      value = (served > 1) ? served : 1;
    }
    if (type === 'next') {
      value++;
    } else if (type === 'prev' && value > 0 && served < value) {
      value--;
    }
    if (value === 0) {
      const dialogRef = this.dialog.open(ConfirmPopupComponent);
      dialogRef.afterClosed().subscribe(data => {
        if (data) {
          this.isDirty = true;
          if (this.serv.notNull(formControl.get('id').value)) {
            formControl.get('deletedFlag').setValue(true);
          } else {

            if (module === 'items') {
              this.items.removeAt(index);
            } else {
              this.comboItems.removeAt(index);
            }
          }
        } else {
          this.isDirty = true;
          formControl.get('quantity').setValue((served > 1) ? served : 1, {emitEvent: false});
        }
        if (module === 'items') {
          this.getOrderItemTotal(formControl);
        } else {
          this.getOrderItemComboTotal(formControl);
        }
      });
    } else {
      formControl.get('quantity').setValue(value, {emitEvent: true});
      this.isDirty = true;
      if (module === 'items') {
        this.getOrderItemTotal(formControl);
      } else {
        this.getOrderItemComboTotal(formControl);
      }
    }
  }


  shortCutKeyHandler(e) {
    if (this.shortCutBlocked)return;

    if (e.code === 'F1') {
      if (this.blockForms) return;
      e.preventDefault();
      this.searchInput.nativeElement.focus();
    } else if ((e.code === 'F2') || (e.ctrlKey && e.code === 'KeyN') || e.code === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      this.openNewHandler(e);
    } else if ((e.ctrlKey && e.code === 'KeyS') || e.code === 'F3') {
      if (this.blockForms) return;
      this.saveOrder('confirm');
    } else if ((e.ctrlKey && e.code === 'KeyK') || e.code === 'F4') {
      if (this.blockForms) return;
      this.saveOrder('kot');
    } else if ((e.ctrlKey && e.code === 'KeyQ') || e.code === 'F9') {
      if (this.blockForms) return;
      this.saveOrder('complete');
    } else if ((e.ctrlKey && e.code === 'KeyX') || e.code === 'F12') {
      if (this.blockForms) return;
      this.saveOrder('cancel');
    } else if (e.code === 'F6') {
      this.changeOrderStatusBack('new');
    }
  }

  openNewHandler(e) {
    const openNew = (e.code === 'new' || e.code === 'F2' || e.code === 'KeyN') ? true : false;
    if (this.items.length > 0 || this.comboItems.length > 0) {
      if (this.serv.notNull(this.form.get('id').value)) {
        if (this.isDirty) {
          const dialogRef = this.dialog.open(ConfirmPopupComponent, {
            data: {
              message: 'Order data is updated. Do you want to save?'
            }
          });
          dialogRef.afterClosed().subscribe(data => {
            if (data) {
              this.saveOrder('confirm');
            } else {
              this.dialogRef.close({
                openNew
              });
            }
          });
        } else {
          this.dialogRef.close({
            openNew
          });
        }
      } else {
        this.unsavedDataUpdateAndClose(openNew);
      }
    } else if (e.code === 'Escape') {
      this.dialogRef.close();
    }
  }

  unsavedDataUpdateAndClose(openNew) {
    this.dialogRef.close({
      openNew,
      unsavedData: this.saveOrder('unsave')
    });
  }


  saveOrder(type = 'confirm') {
    const orderData = {...this.form.value};

    if (this.selectedOrderType.tableRequired) {
      orderData.tables = orderData.tables.map((table: any) => {
        return {
          ...table,
          chairs: table.chairs.filter(chair => (chair.isSelected && chair.permission == 'full')).map(chair => chair.chairId).join(',')
        };
      }).filter(table => table.chairs !== '');
    } else {
      orderData.tables = [];
    }


    if (this.selectedItemTotal <= 0 && type !== 'cancel') {
      this.serv.showMessage('Please add items.', 'error');
      return;
    }
    let message = '';
    if (type === 'kot') {
      if (this.orderDetails && this.orderDetails.orderStatus === 'completed') {
        this.printKot();
      } else if (!this.orderDetails || (this.orderDetails && this.orderDetails.orderStatus !== 'cancelled')) {
        if (this.isDirty) {
          orderData.orderStatus = 'new';
          this.updateOrder(orderData, 'kot');
        } else {
          this.printKot();
        }
      }
    } else if (type === 'confirm') {
      orderData.orderStatus = 'new';
      this.updateOrder(orderData);
      return;
    } else if (type === 'complete') {
      orderData.orderStatus = 'completed';
      message = 'Data will be freezed after completion. Are you sure want to proceed?';

      if (this.branchDetails.completeConfirmation) {
        this.takeConfirmation(orderData, message);
      } else {
        this.updateOrder(orderData);
      }
      return;
    } else if (type === 'cancel') {
      orderData.orderStatus = 'cancelled';
      message = 'Data will be freezed after cancelling. Are you sure want to proceed?';

      if (this.branchDetails.cancelConfirmation) {
        this.takeConfirmation(orderData, message);
      } else {
        this.updateOrder(orderData);
      }
      return;
    } else if (type === 'unsave') {
      return {
        ...orderData,
        selectedOrderType: this.selectedOrderType
      };
    }

  }

  takeConfirmation(orderData, message) {
    this.shortCutBlocked = true;
    const dialogRef = this.dialog.open(ConfirmPopupComponent, {
      data: {
        message
      }
    });
    dialogRef.afterClosed().subscribe(data => {
      this.shortCutBlocked = false;
      if (data) {
        this.updateOrder(orderData);
      }
    });
  }

  updateOrder(orderData, arg = null) {
    if (this.orderProcessing) {
      return;
    }
    this.orderProcessing = true;
    this.serv.endpoint = 'order-manager/order';
    this.serv.post(orderData).subscribe((response: any) => {
      this.isDirty = false;
      this.orderProcessing = false;
      this.orderDetails = response;
      this.handleOrderDetails();
      if (this.orderDetails.orderStatus === 'completed') {
        this.currentlyPrinting = 'bill';
        setTimeout(() => {
          this.invoicePrintHolder.printPage();
          // if (arg === 'kot') {
          if (this.branchDetails.afterCompleteKot) {
            setTimeout(() => {
              this.printKot(() => {
                this.handleAfterUpdate(this.orderDetails);
              });
            }, 300);
          } else {
            this.handleAfterUpdate(this.orderDetails);
          }
          // }
        }, 200);
      } else {
        if (arg === 'kot') {

          this.printKot();
          // this.currentlyPrinting = 'bill';
          // setTimeout(() => {
          //   this.invoicePrintHolder.printPage();
          //   if (arg === 'kot') {
          //     this.printKot();
          //   }
          //   this.handleAfterUpdate(this.orderDetails);
          // }, 200);
        } else {
          this.serv.showMessage('Order saved successfully', 'success');
          this.handleAfterUpdate(this.orderDetails);
        }
      }
    }, ({error}) => {
      this.serv.showMessage(error.msg, 'error');
      this.orderProcessing = false;
    });
  }

  handleAfterUpdate(orderDetails) {
    if (orderDetails.orderStatus === 'completed' || orderDetails.orderStatus === 'cancelled') {
      if (this.branchDetails.onCompleteCancelOrder === 'closeOrderWindow' || this.branchDetails.onCompleteCancelOrder === 'closeAndOpenNewWindow') {
        this.dialogRef.close({
          orderDetails,
          openNew: this.branchDetails.onCompleteCancelOrder === 'closeAndOpenNewWindow'
        });
      }
    } else {
      if (this.branchDetails.onSaveOrder === 'closeOrderWindow' || this.branchDetails.onSaveOrder === 'closeAndOpenNewWindow') {
        this.dialogRef.close({
          orderDetails,
          openNew: this.branchDetails.onSaveOrder === 'closeAndOpenNewWindow'
        });
      }
    }
  }

  printKot(callback = null) {
    if (!this.serv.notNull(this.orderDetails)) {
      if (callback) {
        callback();
      }
      return;
    }
    const orderData = {...this.orderDetails};
    orderData.items = orderData.order_items.filter(item => item.kot_pending > 0);
    if (orderData.items.length <= 0) {
      return;
    }
    this.currentlyPrinting = 'kot';
    setTimeout(() => {
      this.invoicePrintHolder.printPage();
      this.serv.endpoint = 'order-manager/order/kot-print';
      this.serv.post({items: orderData.items}).subscribe(response => {
        this.orderDetails.order_items = this.orderDetails.order_items.map(item => {
          return {
            ...item,
            kot_pending: 0
          };
        });
        if (callback) {
          callback();
        }
      });
    }, 300);
  }


  changeOrderStatusBack(status) {

    const dialogRef = this.dialog.open(ConfirmPopupComponent, {
      data: {
        message: 'Are sure want to reopen?'
      }
    });
    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        this.serv.endpoint = 'order-manager/order/change-order-status';
        this.serv.post({id: this.orderDetails.id, status}).subscribe(response => {
          this.orderDetails = response;
          this.handleOrderDetails();
        }, ({error}) => {
          this.serv.showMessage(error.msg, 'error');
        });
      }
    });
  }

  openCustomerInfoPopup() {
    const formValue = this.form.value;
    const dialofRef = this.dialog.open(CustomerInfoUpdateComponent, {
      width: '500px',
      data: {
        formValue: {
          mobileNumber: formValue.mobileNumber,
          customerName: formValue.customerName,
          customerAddress: formValue.customerAddress,
          relatedInfo: formValue.relatedInfo,
        }
      }
    });
    dialofRef.afterClosed().subscribe(response => {
      if (response) {
        this.form.patchValue(response);
      }
    })
  }

  manageClock() {
    let currentHour = parseInt((moment(new Date())).format('hh'));
    let currentMinute = parseInt((moment(new Date())).format('mm'));
    if (currentHour < 3) {
      currentHour = currentHour + 12;
    }
    this.hourRotation = (currentHour - 3) * 30;
    if (currentMinute > 40) {
      this.hourRotation = this.hourRotation + 15;
    }
    if (currentMinute < 15) {
      currentMinute = currentMinute + 60;
    }
    this.minuteRotation = (currentMinute - 15) * 6;
  }

  ngOnDestroy() {
    window.removeEventListener('keydown', this.keyListener, true);
  }

}
