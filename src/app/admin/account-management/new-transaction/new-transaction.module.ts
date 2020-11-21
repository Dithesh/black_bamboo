import { SharedModule } from './../../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NewTransactionRoutingModule } from './new-transaction-routing.module';
import { NewTransactionComponent } from './new-transaction.component';


@NgModule({
  declarations: [NewTransactionComponent],
  imports: [
    CommonModule,
    NewTransactionRoutingModule,
    SharedModule
  ]
})
export class NewTransactionModule { }
