import { Component, OnInit } from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {QuickOrderUpdateComponent} from "./quick-order-update/quick-order-update.component";

@Component({
  selector: 'app-quick-order',
  templateUrl: './quick-order.component.html',
  styleUrls: ['./quick-order.component.scss']
})
export class QuickOrderComponent implements OnInit {

  constructor(
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
  }

  openQuickUpdate(item = null) {
    this.dialog.open(
      QuickOrderUpdateComponent,
      {
        width: 'calc(100vw - 50px)',
        height: 'calc(100vh - 50px)'
      }
    )
  }

}
