import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoleGaurd } from 'src/app/shared/gaurd/role-gaurd';
import { ReportManagerComponent } from './report-manager.component';


const routes: Routes = [
  {
    path: "",
    component: ReportManagerComponent,
    data: {
      module: 'order-report',
      mode: 'full'
    },
    canActivate: [ RoleGaurd ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportManagerRoutingModule { }
