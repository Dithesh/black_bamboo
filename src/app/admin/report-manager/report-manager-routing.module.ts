import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportManagerComponent } from './report-manager.component';


const routes: Routes = [
  {
    path: "",
    component: ReportManagerComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportManagerRoutingModule { }
