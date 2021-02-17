import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoleGaurd } from 'src/app/shared/gaurd/role-gaurd';
import { ReportManagerComponent } from './report-manager.component';


const routes: Routes = [
  {
    path: "",
    component: ReportManagerComponent,
    children: [
      { 
        path: 'order-report', 
        loadChildren: () => import('./order-report/order-report.module').then(m => m.OrderReportModule),
        data: {
          module: 'order-report',
          mode: 'full'
        },
        canActivate: [ RoleGaurd ]
      },
      { 
        path: 'item-sale-report', 
        loadChildren: () => import('./item-sale-report/item-sale-report.module').then(m => m.ItemSaleReportModule) 
      },
      {
        path: "**",
        pathMatch: 'full',
        redirectTo: "order-report"
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportManagerRoutingModule { }
