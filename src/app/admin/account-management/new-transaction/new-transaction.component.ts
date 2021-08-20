import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/shared/services/data.service';
import { NewTransactionService } from './new-transaction.service';
import {debounceTime} from "rxjs/operators";

@Component({
  selector: 'app-new-transaction',
  templateUrl: './new-transaction.component.html',
  styleUrls: ['./new-transaction.component.scss']
})
export class NewTransactionComponent implements OnInit {
  companyList;
  userData;
  transactionId;
  constructor(
    private route: ActivatedRoute,
    public transact: NewTransactionService,
    private serv: DataService
  ) {
    this.userData = this.serv.getUserData();

    this.route.data.subscribe(response => {
      this.companyList = response.companyList;
      if (this.companyList.length > 0) {
        this.transact.form.get('company_id').setValue(this.companyList[0].id);
        this.transact.getBranchList();
        this.transact.resetData();
      }
    });
    //.pipe(debounceTime(0))
    this.transact.form.get('company_id').valueChanges.subscribe(response => {
      this.transact.getBranchList();
    });
  }

  ngOnInit(): void {
    this.transactionId = this.route.firstChild.snapshot.params.id;
  }


}
