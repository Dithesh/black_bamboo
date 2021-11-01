import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import * as moment from 'moment';
import {DataService} from '../../../../shared/services/data.service';
import {OrderUpdateManagerComponent} from './order-update-manager/order-update-manager.component';
import {map, startWith} from "rxjs/operators";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-quick-order',
  templateUrl: './quick-order.component.html',
  styleUrls: ['./quick-order.component.scss']
})
export class QuickOrderComponent implements OnInit, OnDestroy {
  ongoingorders: any[] = [];
  blockShortCut = false;
  keyListener = this.shortCutKeyHandler.bind(this);
  unsavedOrderList: any[] = [];

  userData: any;
  blockOrdering = false;
  productList: any[] = [];
  favItemMenu: any[] = [];
  branchDetails: any;
  completedOrders;

  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private serv: DataService
  ) {
    this.route.data.subscribe(response => {

      this.branchDetails = response.data.branchDetails;

      this.handleProductData(response.data.productList, response.data.comboList);
      // this.handeProductItemCombo(response.data.comboList);
      this.handleFavoritemenuData(response.data.favItems);
    });
  }

  ngOnInit(): void {
    this.getOngoingOrders();
    this.getFinishedOrders();
    window.addEventListener('keydown', this.keyListener, true);


    this.userData = this.serv.getUserData();
    if (this.userData.roles === 'Super Admin' || this.userData.roles === 'Company Admin') {
      this.blockOrdering = true;
    }

    // this.openOrderUpdateManager();
  }

  handleProductData(products, combos) {
    this.productList = (products as any[]).map(item => {
      item.products = item.products.map(product => {
        let advancedPriceId = '';
        let advancedPriceTitle = '';
        let price = product.price;

        if (product.isAdvancedPricing && product.advanced_pricing.length > 0) {
          advancedPriceId = product.advanced_pricing[0].id;
          advancedPriceTitle = product.advanced_pricing[0].title;
          price = product.advanced_pricing[0].price;
        }
        return {
          ...product,
          uid: 'product_' + product.id,
          name: product.productName,
          isParcel: false,
          quantity: 1,
          price,
          advancedPriceId,
          advancedPriceTitle,
        };
      });
      return item;
    });
    this.productList.push({
      categoryName: 'Combo Items',
      products: (combos as any[]).map(item => {
        return {
          ...item,
          uid: 'combo_' + item.id,
          name: item.comboTitle,
          productNumber: '',
          advanced_pricing: [],
          advancedPriceId: '',
          advancedPriceTitle: '',
          isParcel: false,
          quantity: 1
        };
      })
    });
  }

  handleFavoritemenuData(response) {
    this.favItemMenu = (response as any[]).map(item => {
      item.products = item.favorite_items.map(fav => {
        const product = fav.product;
        let advancedPriceId = '';
        let advancedPriceTitle = '';
        let price = product.price;

        if (product.isAdvancedPricing && product.advanced_pricing.length > 0) {
          advancedPriceId = product.advanced_pricing[0].id;
          advancedPriceTitle = product.advanced_pricing[0].title;
          price = product.advanced_pricing[0].price;
        }
        return {
          ...product,
          uid: 'product_' + product.id,
          isParcel: false,
          quantity: 1,
          price,
          advancedPriceId,
          advancedPriceTitle,
        };
      });
      item.combos = item.favorite_combo_items.map(fav => {
        const combo = fav.product;
        return {
          ...combo,
          uid: 'combo_' + combo.id,
          isParcel: false,
          quantity: 1,
          advanced_pricing: [],
          advancedPriceId: '',
          advancedPriceTitle: '',
          price: combo.comboTotal
        };
      });
      delete item['item.favorite_items'];
      delete item['item.favorite_combo_items'];
      return item;
    });
  }

  getOrderDetail(item) {
    this.serv.endpoint = 'order-manager/order/' + item.id;
    this.serv.get().subscribe((response: any) => {
      this.openOrderUpdateManager(response);
    });
  }

  openOrderUpdateManager(item = null, type = 'saved', unsavedIndex = null) {
    this.blockShortCut = true;
    const dialogRef = this.dialog.open(
      OrderUpdateManagerComponent,
      {
        maxWidth: '1530px',
        width: 'calc(100vw - 50px)',
        height: 'calc(100vh - 50px)',
        panelClass: 'new_order_dialog',
        data: {
          orderDetails: ((type === 'saved') ? item : null),
          unsavedData: ((type === 'unsaved') ? item : null),
          itemSavedType: type,
          branchDetails: this.branchDetails,
          productList: this.productList,
          favItemMenu: this.favItemMenu
        },
        disableClose: true
      }
    );

    dialogRef.afterClosed().subscribe(response => {
      this.blockShortCut = false;
      this.getOngoingOrders();
      this.getFinishedOrders();
      if (response && response.unsavedData) {
        if (unsavedIndex != null) {
          this.unsavedOrderList[unsavedIndex] = {
            ...response.unsavedData,
            created_at: new Date()
          };
        } else {
          this.unsavedOrderList.push({
            ...response.unsavedData,
            created_at: new Date()
          });
        }
      } else if (unsavedIndex != null) {
        this.removeUnsaved(unsavedIndex);
      }
      if (response && response.openNew) {
        this.openOrderUpdateManager();
      }
    });
  }

  getOngoingOrders() {
    const startDate = moment(new Date()).format('YYYY-MM-DD');
    const endDate = moment(new Date()).format('YYYY-MM-DD');
    this.serv.endpoint = 'order-manager/order?'
      + '&orderStatus=new,accepted,prepairing,packing'
      + '&startDate=' + startDate
      + '&endDate=' + endDate
      + '&ongoing=true'
      + '&orderType=desc'
      + '&orderCol=updated_at';
    this.serv.get().subscribe((response: any) => {
      this.ongoingorders = response;
    });
  }

  getFinishedOrders() {
    const startDate = moment(new Date()).format('YYYY-MM-DD');
    const endDate = moment(new Date()).format('YYYY-MM-DD');
    this.serv.endpoint = 'order-manager/order?'
      + '&orderStatus=completed,cancelled'
      + '&startDate=' + startDate
      + '&endDate=' + endDate
      + '&orderType=desc'
      + '&orderCol=updated_at';
    this.serv.get().subscribe((response: any) => {
      this.completedOrders = response;
    });
  }

  shortCutKeyHandler(e) {
    if (!this.blockShortCut) {
      if ((e.ctrlKey && e.code === 'KeyN') || e.code === 'F2') {
        e.stopPropagation();
        e.preventDefault();
        this.openOrderUpdateManager();
      }
    }
  }

  removeUnsaved(i) {
    this.unsavedOrderList.splice(i, 1);
  }

  ngOnDestroy() {
    window.removeEventListener('keydown', this.keyListener, true);
  }

}
