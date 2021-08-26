import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NewTransactionService } from '../new-transaction.service';

@Component({
  selector: 'app-new-receipt',
  templateUrl: './new-receipt.component.html',
  styleUrls: ['./new-receipt.component.scss']
})
export class NewReceiptComponent implements OnInit {

  constructor(
    public transact: NewTransactionService,
    private route: ActivatedRoute
  ) {

    this.transact.resetData(this.route.snapshot.params.id);
    this.transact.setTransactionType('receipt');
  }

  ngOnInit(): void {
  }

}
