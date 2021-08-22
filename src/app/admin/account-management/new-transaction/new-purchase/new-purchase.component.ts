import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NewTransactionService } from '../new-transaction.service';

@Component({
  selector: 'app-new-purchase',
  templateUrl: './new-purchase.component.html',
  styleUrls: ['./new-purchase.component.scss']
})
export class NewPurchaseComponent implements OnInit {

  constructor(
    public transact: NewTransactionService,
    private route: ActivatedRoute
  ) {
    this.transact.setTransactionType('purchase');
    this.transact.resetData(this.route.snapshot.params.id);
  }

  ngOnInit(): void {
  }




}
