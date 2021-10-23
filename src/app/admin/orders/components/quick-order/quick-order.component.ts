import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {QuickOrderUpdateComponent} from './quick-order-update/quick-order-update.component';
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
  comboItemList: any[] = [];
  favItemMenu: any[] = [];
  branchDetails: any;

  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private serv: DataService
  ) {
    this.route.data.subscribe(response => {

      this.branchDetails = response.data.branchDetails;

      this.handleProductData(response.data.productList);
      this.handeProductItemCombo(response.data.comboList);
      this.handleFavoritemenuData(response.data.favItems);
    });
  }

  ngOnInit(): void {
    this.getOngoingOrders();
    window.addEventListener('keydown', this.keyListener, true);


    this.userData = this.serv.getUserData();
    if (this.userData.roles === 'Super Admin' || this.userData.roles === 'Company Admin') {
      this.blockOrdering = true;
    }

    this.openOrderUpdateManager();
  }

  handleProductData(response) {
    this.productList = (response as any[]).map(item => {
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
          isParcel: false,
          quantity: 1,
          price,
          advancedPriceId,
          advancedPriceTitle,
        };
      });
      return item;
    });
  }

  handleFavoritemenuData(response) {
    console.log(response);
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
          isParcel: false,
          quantity: 1,
          price,
          advancedPriceId,
          advancedPriceTitle,
        };
      });
      delete item['item.favorite_items'];
      return item;
    });
  }


  handeProductItemCombo(response) {
    this.comboItemList = (response as any[]).map(item => {
        return {
          ...item,
          isParcel: false,
          quantity: 1
        };
    });
  }

  getOrderDetail(item) {
    this.serv.endpoint = 'order-manager/order/' + item.id;
    this.serv.get().subscribe((response: any) => {
      this.openOrderUpdateManager(response);
    });
  }

  openOrderUpdateManager(item = null, type= 'saved', unsavedIndex = null) {this.blockShortCut = true;
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
          comboItemList: this.comboItemList,
          favItemMenu: this.favItemMenu
        }
      }
    );

                                                                           dialogRef.afterClosed().subscribe(response => {
      this.blockShortCut = false;
      this.getOngoingOrders();
      if (response && response.unsavedData) {
          console.log(response.unsavedData);
          if (unsavedIndex != null) {
          this.unsavedOrderList[unsavedIndex] = {
            ...response.unsavedData,
            created_at: new Date()
          };
        }else {
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
                            + '&orderType=desc'
                            + '&orderCol=updated_at';
    this.serv.get().subscribe((response: any) => {
      this.ongoingorders = response;
    });
  }

  shortCutKeyHandler(e) {
    if (!this.blockShortCut) {
      if (e.ctrlKey && e.code === 'KeyN') {
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
