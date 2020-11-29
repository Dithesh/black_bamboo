import { NewTransactionComponent } from './new-transaction.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewPaymentComponent } from './new-payment/new-payment.component';
import { NewReceiptComponent } from './new-receipt/new-receipt.component';
import { NewPurchaseComponent } from './new-purchase/new-purchase.component';
import { NewSalesComponent } from './new-sales/new-sales.component';
import { CompanyListResolver } from '../../resolvers/company-list.resolver';


const routes: Routes = [{
  path:"",
  component:NewTransactionComponent,
  resolve: {
    companyList: CompanyListResolver
  },
  children: [
    {
      path: "payment",
      component: NewPaymentComponent
    },
    {
      path: "receipt",
      component: NewReceiptComponent
    },
    {
      path: "purchase",
      component: NewPurchaseComponent
    },
    {
      path: "sales",
      component: NewSalesComponent
    },
    {
      path: "**",
      redirectTo: 'sales',
      pathMatch: 'full'
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NewTransactionRoutingModule { }
