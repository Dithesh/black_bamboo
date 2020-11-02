import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { LayoutService } from '../admin/layout/services/layout.service';
import { DataService } from '../shared/services/data.service';

@Component({
  selector: 'app-kitchen',
  templateUrl: './kitchen.component.html',
  styleUrls: ['./kitchen.component.scss']
})
export class KitchenComponent implements OnInit {
  orderData;
  itemData;
  branchId;
  url = environment.imgUrl;
  constructor(
    private _serv: DataService,
    private route: ActivatedRoute,
    public _layout: LayoutService,
  ) { 
    this.branchId = this.route.snapshot.params.branch;
  }

  ngOnInit(): void {
    this._layout.isOpened=false;
    // this.getOrderStats();


    // setInterval(()=> {
    //   this.getOrderStats();
    // }, 30000)
  }


  getOrderStats() {
    this._serv.endpoint = "kitchen/"+this.branchId;
    this._serv.get().subscribe((response:any) => {
      console.log(response.orders);
      this.itemData = response.items;
      this.orderData = response.orders;
    })
  }

}
