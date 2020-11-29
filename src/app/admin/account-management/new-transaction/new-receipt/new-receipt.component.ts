import { Component, OnInit } from '@angular/core';
import { NewTransactionService } from '../new-transaction.service';

@Component({
  selector: 'app-new-receipt',
  templateUrl: './new-receipt.component.html',
  styleUrls: ['./new-receipt.component.scss']
})
export class NewReceiptComponent implements OnInit {

  constructor(
    public _transact: NewTransactionService
  ) { 
    this._transact.resetData();
    this._transact.setTransactionType('receipt');
  }

  ngOnInit(): void {
  }

}
