import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AcTopBarComponent } from './ac-top-bar/ac-top-bar.component';
import { RouterModule } from '@angular/router';
import { AcSideBarComponent } from './ac-side-bar/ac-side-bar.component';
import { AcLayoutComponent } from './ac-layout/ac-layout.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDividerModule } from '@angular/material/divider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [AcTopBarComponent, AcSideBarComponent, AcLayoutComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    MatSidenavModule,
    MatDividerModule,
    MatToolbarModule,
  ],
  exports: [
    AcLayoutComponent
  ]
})
export class AcSharedModule { }
