import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/shared/services/data.service';
import { NewTransactionService } from '../new-transaction.service';

@Component({
  selector: 'app-new-sales',
  templateUrl: './new-sales.component.html',
  styleUrls: ['./new-sales.component.scss']
})
export class NewSalesComponent implements OnInit {
  constructor(
    public transact: NewTransactionService,
    private route: ActivatedRoute
  ) {

    this.transact.resetData(this.route.snapshot.params.id);
    this.transact.setTransactionType('sales');
  }

  ngOnInit(): void {
  }




}
