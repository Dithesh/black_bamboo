import { Component, OnDestroy, OnInit } from '@angular/core';
import { DataService } from 'src/app/shared/services/data.service';
import * as moment from 'moment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  ongoingorders: any;
  completedOrders: any;
  timeoutController;
  constructor(
    private _serv: DataService
  ) { }

  ngOnInit(): void {
    this.getData();
    this.timeoutController = setInterval(() => {
      this.getData();
    },120000)
  }

  getData() {
    this.getDashboardOnGoingOrders();
    this.getDashboardCompletedOrders();
  }

  getDashboardOnGoingOrders() {
    let startDate = moment(new Date()).format('YYYY-MM-DD');
    let endDate = moment(new Date()).format('YYYY-MM-DD');
    this._serv.endpoint = "order-manager/order?"
                            + "&orderStatus=new,accepted,prepairing,packing"
                            + "&startDate="+startDate
                            + "&endDate="+endDate
                            + "&orderType=asc"
                            + "&orderCol=updated_at"
    this._serv.get().subscribe((response:any) => {
      this.ongoingorders=[];
      response.forEach(elem => {
        this._serv.timerUpdate(elem);
        this.ongoingorders.push(elem);
      });
    })
  }

  getDashboardCompletedOrders() {
    let startDate = moment(new Date()).format('YYYY-MM-DD');
    let endDate = moment(new Date()).format('YYYY-MM-DD');
    this._serv.endpoint = "order-manager/order?"
                            + "&orderStatus=dispatched,delivered,completed,cancelled"
                            + "&startDate="+startDate
                            + "&endDate="+endDate
                            + "&orderType=asc"
                            + "&orderCol=updated_at"
    this._serv.get().subscribe(response => {
      this.completedOrders = response as any;
    })
  }

  ngOnDestroy() {
    if(this.timeoutController) {
      clearInterval(this.timeoutController);
    }
  }

}
