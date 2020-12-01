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
    public _transact: NewTransactionService,
    private route: ActivatedRoute
  ) { 
    
    this._transact.resetData(this.route.snapshot.params.id);
    this._transact.setTransactionType('receipt');
  }

  ngOnInit(): void {
  }

}
