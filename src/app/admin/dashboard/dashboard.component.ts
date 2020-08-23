import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/shared/services/data.service';
import * as moment from 'moment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  ongoingorders: any;
  completedOrders: any;
  constructor(
    private _serv: DataService
  ) { }

  ngOnInit(): void {
    this.getData();
    setInterval(() => {
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
    this._serv.get().subscribe(response => {
      this.ongoingorders = response as any;
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

}
