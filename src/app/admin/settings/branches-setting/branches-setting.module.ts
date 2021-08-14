import { UpdateBranchComponent } from './update-branch/update-branch.component';
import { SharedModule } from './../../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BranchesSettingRoutingModule } from './branches-setting-routing.module';
import { BranchListComponent } from './branch-list/branch-list.component';
import { TableSetupComponent } from './table-setup/table-setup.component';
import { TableUpdateComponent } from './table-setup/table-update/table-update.component';


@NgModule({
  declarations: [BranchListComponent, UpdateBranchComponent, TableSetupComponent, TableUpdateComponent],
  entryComponents: [
    TableUpdateComponent
  ],
  imports: [
    CommonModule,
    BranchesSettingRoutingModule,
    SharedModule
  ]
})
export class BranchesSettingModule { }
