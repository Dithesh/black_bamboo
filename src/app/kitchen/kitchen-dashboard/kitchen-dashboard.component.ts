import { Component, OnInit } from '@angular/core';
import { LayoutService } from 'src/app/admin/layout/services/layout.service';
import { DataService } from 'src/app/shared/services/data.service';
import { SharedKitchenService } from '../shared/shared-kitchen.service';

@Component({
  selector: 'app-kitchen-dashboard',
  templateUrl: './kitchen-dashboard.component.html',
  styleUrls: ['./kitchen-dashboard.component.scss']
})
export class KitchenDashboardComponent implements OnInit {
  newOrders=[];
  readyOrders=[];
  consolidatedItems=[];

  constructor(private _kitchen: SharedKitchenService, private _serv: DataService, public _layout: LayoutService) { }

  ngOnInit(): void {
    this._kitchen.kirchenChangeService.subscribe(response => {
      if(response) {
        this.getKitchenData();
      }
    })

    setInterval(() => {
      this.getKitchenData();
    }, 60000)
  }

  getKitchenData() {
    this._serv.endpoint="order-manager/kitchen?branch_id="+this._kitchen.kitchen_details.branch_id + '&kitchen_id='+this._kitchen.kitchen_details.id;
    this._serv.get().subscribe((response:any) => {
      this.newOrders=[];
      this.readyOrders=[];
      this._kitchen.consolidatedProducts = response.items;
      response.orders.forEach(elem => {
        let newItems=false;
        let aceptedItems=false;
        elem['readySelectAll']=false;
        elem['acceptSelectAll']=false;
        this._serv.timerUpdate(elem);
        elem.order_items.forEach(item => {
          item['isAcceptSelected']=false;
          item['isReadySelected']=false;
          if(item.acceptPendingQuantity > 0){
            newItems=true;
          }
          if(item.readyPendingQuantity > 0){
            aceptedItems=true;
          }
        })
        if(newItems){
          this.newOrders.push(elem);
        }
        if(aceptedItems){
          this.readyOrders.push(elem);
        }
      })
    })
  }

  selectAll(item, selected=false,  type='accept') {
    item.order_items.forEach(elem => {
      if(type == 'accept' && elem.acceptPendingQuantity > 0) {
        elem.isAcceptSelected=selected;
      }
      if(type == 'ready' && elem.readyPendingQuantity > 0) {
        elem.isReadySelected=selected;
      }
    })
  }

  checkSelectAll(item, type='accept') {
    let readySelectAll=true;
    let acceptSelectAll=true;

    item.order_items.forEach(elem => {
      if(type == 'accept' && elem.acceptPendingQuantity > 0) {
        if(!elem.isAcceptSelected) {
          acceptSelectAll=false;
        }
      }
      if(type == 'ready' && (elem.readyPendingQuantity > 0)) {
        if(!elem.isReadySelected) {
          readySelectAll=false;
        }
      }
    })

    if(type == 'accept'){
      item.acceptSelectAll=acceptSelectAll;
    }else if(type=='ready') {
      item.readySelectAll=readySelectAll;
    }
  }

  getSelectedItemCount(item, type='accept') {let readySelectAll=true;
    let acceptSelectCount=0;
    let readySelectCount=0;

    item.order_items.forEach(elem => {
      if(type == 'accept' && elem.acceptPendingQuantity > 0) {
        if(elem.isAcceptSelected) {
          acceptSelectCount++;
        }
      }
      if(type == 'ready' && (elem.readyPendingQuantity > 0)) {
        if(elem.isReadySelected) {
          readySelectCount++;
        }
      }
    })

    if(type == 'accept'){
      return acceptSelectCount;
    }else if(type=='ready') {
      return readySelectCount;
    }
  }

  updateSingleItem(item, type) {
    let orderItems=[];
    if(type == 'accept' || type == 'reject') {
      orderItems.push({id: item.id, quantity: item.acceptPendingQuantity});
    }else if(type == 'ready') {
      orderItems.push({id: item.id, quantity: item.readyPendingQuantity});
    }

    this.updateOrderItemStatus(orderItems, type);

  }

  updateMultipleItems(order, type) {
    let orderItems=[];
    order.order_items.forEach(item => {
      if((type == 'accept' || type == 'reject') && item.isAcceptSelected && item.acceptPendingQuantity>0) {
        orderItems.push({id: item.id, quantity: item.acceptPendingQuantity});
      }else if(type == 'ready' && item.isReadySelected && item.readyPendingQuantity > 0) {
        orderItems.push({id: item.id, quantity: item.readyPendingQuantity});
      }
    })
    
    if(orderItems.length > 0)
      this.updateOrderItemStatus(orderItems, type);

  }

  updateOrderItemStatus(orderItems, type){
    this._serv.endpoint = "order-manager/kitchen";
    this._serv.post({orderItems: orderItems, type: type}).subscribe(response => {
      this.getKitchenData();
      this._serv.showMessage('Item updated successfully', 'success');
    }, error => {
      this._serv.showMessage(error.error[0], 'error');
    })
  }



}
