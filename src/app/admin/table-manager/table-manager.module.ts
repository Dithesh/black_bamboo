import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TableManagerRoutingModule } from './table-manager-routing.module';
import { TableManagerComponent } from './table-manager.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [TableManagerComponent],
  imports: [
    CommonModule,
    TableManagerRoutingModule,
    SharedModule
  ]
})
export class TableManagerModule { }
