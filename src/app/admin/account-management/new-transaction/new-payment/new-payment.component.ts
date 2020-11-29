import { Component, OnInit } from '@angular/core';
import { NewTransactionService } from '../new-transaction.service';

@Component({
  selector: 'app-new-payment',
  templateUrl: './new-payment.component.html',
  styleUrls: ['./new-payment.component.scss']
})
export class NewPaymentComponent implements OnInit {


  constructor(
    public _transact: NewTransactionService
  ) { 
    this._transact.resetData();
    this._transact.setTransactionType('payment');
  }

  ngOnInit(): void {
  }

}
