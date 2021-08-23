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

    if (this.userData.roles === 'Super Admin') {
      // this.getAllCompanies();
    } else if (this.userData.roles === 'Company Admin') {
      this.transact.form.patchValue({
        company_id: this.userData.company_id
      }, {emitEvent: false});
      this.transact.getBranchList();
    }else {
      this.transact.form.patchValue({
          company_id: this.userData.company_id,
          branch_id: this.userData.branch_id
      }, {emitEvent: false});
    }

    this.route.data.subscribe(response => {
      this.companyList = response.companyList;
    });
    this.transact.form.get('company_id').valueChanges.subscribe(response => {
      this.transact.getBranchList();
    });
    this.transact.resetData();
  }

  ngOnInit(): void {
    this.transactionId = this.route.firstChild.snapshot.params.id;
  }


}
