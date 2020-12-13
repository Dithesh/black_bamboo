import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AttendanceRoutingModule } from './attendance-routing.module';
import { AttendanceComponent } from './attendance.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { UpdateAttandanceComponent } from './update-attandance/update-attandance.component';


@NgModule({
  declarations: [AttendanceComponent, UpdateAttandanceComponent],
  entryComponents: [UpdateAttandanceComponent],
  imports: [
    CommonModule,
    AttendanceRoutingModule,
    SharedModule
  ]
})
export class AttendanceModule { }
