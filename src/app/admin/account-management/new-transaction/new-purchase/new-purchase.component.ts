import { Component, OnInit } from '@angular/core';
import { NewTransactionService } from '../new-transaction.service';

@Component({
  selector: 'app-new-purchase',
  templateUrl: './new-purchase.component.html',
  styleUrls: ['./new-purchase.component.scss']
})
export class NewPurchaseComponent implements OnInit {

  constructor(
    public _transact: NewTransactionService
  ) { 
    this._transact.resetData();
    this._transact.setTransactionType('purchase');
  }

  ngOnInit(): void {
  }




}
