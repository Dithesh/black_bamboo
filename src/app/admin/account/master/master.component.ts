import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-master',
  templateUrl: './master.component.html',
  styleUrls: ['./master.component.scss']
})
export class MasterComponent implements OnInit {
  sideMenu = [
    {
      key: "Ledger Account",
      link: "/admin/account/master/ledger"
    },
    {
      key: "Inventories",
      link: "/admin/account/master/inventory"
    },
    {
      key: "Units",
      link: "/admin/account/master/unit"
    }
  ]
  constructor() { }

  ngOnInit(): void {
  }

}
