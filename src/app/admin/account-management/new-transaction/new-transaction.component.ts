import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/shared/services/data.service';
import { NewTransactionService } from './new-transaction.service';

@Component({
  selector: 'app-new-transaction',
  templateUrl: './new-transaction.component.html',
  styleUrls: ['./new-transaction.component.scss']
})
export class NewTransactionComponent implements OnInit {
  companyList;
  branchList;
  filteredBranchList;
  userData;
  constructor(
    private route: ActivatedRoute,
    public _transact: NewTransactionService,
    private _serv: DataService
  ) { 
    this.userData = this._serv.getUserData();
    this.route.data.subscribe(response => {
      this.companyList = response.companyList;
      if(this.companyList.length > 0) {
        this._transact.form.get('company_id').setValue(this.companyList[0].id);
        this.getBranchList();
        this._transact.resetData();
      }
    })
  }

  ngOnInit(): void {
  }

  getBranchList() {
    this._serv.endpoint = "order-manager/branch?status=active&companyId="+this._transact.form.get('company_id').value;
    this._serv.get().subscribe(response => {
      this.branchList = response as any[];
      this.filteredBranchList = this.branchList;
    })
  }

}
