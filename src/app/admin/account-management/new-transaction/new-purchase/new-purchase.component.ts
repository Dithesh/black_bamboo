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
    public _transact: NewTransactionService,
    private route: ActivatedRoute
  ) { 
    
    this._transact.resetData(this.route.snapshot.params.id);
    this._transact.setTransactionType('purchase');
  }

  ngOnInit(): void {
  }




}
