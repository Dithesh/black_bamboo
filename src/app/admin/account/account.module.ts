import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountRoutingModule } from './account-routing.module';
import { DashbordComponent } from './dashbord/dashbord.component';
import { TransactionListComponent } from './transaction-list/transaction-list.component';
import { MakeTransactionComponent } from './make-transaction/make-transaction.component';
import { ReportComponent } from './report/report.component';


@NgModule({
  declarations: [DashbordComponent, TransactionListComponent, MakeTransactionComponent, ReportComponent],
  imports: [
    CommonModule,
    AccountRoutingModule,
  ]
})
export class AccountModule { }
