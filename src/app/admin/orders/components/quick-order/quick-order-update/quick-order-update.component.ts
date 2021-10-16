import { Component, OnInit } from '@angular/core';
import {NewOrderComponent} from "../../new-order/new-order.component";
import {FormBuilder} from "@angular/forms";
import {DataService} from "../../../../../shared/services/data.service";
import {ActivatedRoute, Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-quick-order-update',
  templateUrl: './quick-order-update.component.html',
  styleUrls: ['./quick-order-update.component.scss']
})
export class QuickOrderUpdateComponent extends NewOrderComponent implements OnInit {

  constructor(
    protected fb: FormBuilder,
    protected _serv: DataService,
    protected route: ActivatedRoute,
    protected router: Router,
    protected dialog: MatDialog
  ) {
    super(
      fb,
      _serv,
      route,
      router,
      dialog
    );
  }
}
