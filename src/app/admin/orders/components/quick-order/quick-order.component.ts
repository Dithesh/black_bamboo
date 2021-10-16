import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {QuickOrderUpdateComponent} from "./quick-order-update/quick-order-update.component";
import * as moment from "moment";
import {DataService} from "../../../../shared/services/data.service";

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

  constructor(
    private dialog: MatDialog,
    private serv: DataService
  ) { }

  ngOnInit(): void {
    this.getOngoingOrders();
    window.addEventListener('keydown', this.keyListener, true);
  }

  openQuickUpdate(item = null, type="saved", unsavedIndex = null) {
    this.blockShortCut = true;
    const dialogRef = this.dialog.open(
      QuickOrderUpdateComponent,
      {
        maxWidth: '1530px',
        width: 'calc(100vw - 50px)',
        height: 'calc(100vh - 50px)',
        data: {
          orderId: (item ? item.id : ''),
          unsavedData: item,
          itemSavedType: type
        }
      }
    );

    dialogRef.afterClosed().subscribe(response => {
      this.blockShortCut = false;
      this.getOngoingOrders();
      if (response && response.unsavedData) {
          console.log(response.unsavedData)
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
        this.openQuickUpdate();
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
        this.openQuickUpdate();
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
