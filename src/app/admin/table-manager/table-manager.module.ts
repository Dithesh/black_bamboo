import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TableManagerRoutingModule } from './table-manager-routing.module';
import { TableManagerComponent } from './table-manager.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { TableListComponent } from './table-list/table-list.component';


@NgModule({
  declarations: [TableManagerComponent, TableListComponent],
  imports: [
    CommonModule,
    TableManagerRoutingModule,
    SharedModule
  ]
})
export class TableManagerModule { }
