import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TableManagerRoutingModule } from './table-manager-routing.module';
import { TableManagerComponent } from './table-manager.component';


@NgModule({
  declarations: [TableManagerComponent],
  imports: [
    CommonModule,
    TableManagerRoutingModule
  ]
})
export class TableManagerModule { }
