import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountMasterRoutingModule } from './account-master-routing.module';
import { InventoryManagerComponent } from '../inventory-manager/inventory-manager.component';
import { UnitManagerComponent } from './unit-manager/unit-manager.component';
import { LedgerManagerComponent } from './ledger-manager/ledger-manager.component';
import { AccountSettingsManagerComponent } from './account-settings-manager/account-settings-manager.component';
import { AccountMasterComponent } from './account-master.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [InventoryManagerComponent, UnitManagerComponent, LedgerManagerComponent, AccountSettingsManagerComponent, AccountMasterComponent],
  imports: [
    CommonModule,
    AccountMasterRoutingModule,
    SharedModule
  ],
  providers: [
  ]
})
export class AccountMasterModule { }
