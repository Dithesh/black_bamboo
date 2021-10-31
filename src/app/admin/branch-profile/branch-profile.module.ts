import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BranchProfileRoutingModule } from './branch-profile-routing.module';
import { BranchProfileComponent } from './branch-profile.component';
import { BasicProfileComponent } from './basic-profile/basic-profile.component';
import { AppConfigurationComponent } from './app-configuration/app-configuration.component';
import { AppGuideComponent } from './app-guide/app-guide.component';
import {SharedModule} from "../../shared/shared.module";


@NgModule({
  declarations: [
    BranchProfileComponent,
    BasicProfileComponent,
    AppConfigurationComponent,
    AppGuideComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    BranchProfileRoutingModule
  ]
})
export class BranchProfileModule { }
