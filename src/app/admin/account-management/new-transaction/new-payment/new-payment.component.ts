import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NewTransactionService } from '../new-transaction.service';

@Component({
  selector: 'app-new-payment',
  templateUrl: './new-payment.component.html',
  styleUrls: ['./new-payment.component.scss']
})
export class NewPaymentComponent implements OnInit {


  constructor(
    public transact: NewTransactionService,
    private route: ActivatedRoute
  ) {

    this.transact.resetData(this.route.snapshot.params.id);
    this.transact.setTransactionType('payment');
  }

  ngOnInit(): void {
  }

}
