import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AcSharedModule } from './../ac-shared/ac-shared.module';
import { MasterRoutingModule } from './master-routing.module';
import { MasterComponent } from './master.component';
import { InventoryComponent } from './inventory/inventory.component';
import { UnitsComponent } from './units/units.component';
import { LedgerAccountsComponent } from './ledger-accounts/ledger-accounts.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDividerModule } from '@angular/material/divider';
import { MatToolbarModule } from '@angular/material/toolbar';


@NgModule({
  declarations: [MasterComponent, InventoryComponent, UnitsComponent, LedgerAccountsComponent],
  imports: [
    CommonModule,
    MasterRoutingModule,
    MatSidenavModule,
    MatDividerModule,
    MatToolbarModule,
    AcSharedModule,
    SharedModule
  ]
})
export class MasterModule { }
