import { ProductListComponent } from './product-list/product-list.component';
import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductsComponent } from './products.component';
import { AddProductComponent } from './components/add-product/add-product.component';


const routes: Routes = [
  {
    path:"",
    children:[
      {
        path:"",
        component:ProductsComponent,
        children:[
          {
            path:"list",
            component:ProductListComponent
          },
          {
            path:"update",
            component:AddProductComponent
          },
          {
            path:"update/:id",
            component:AddProductComponent
          },
          {
            path:"**",
            redirectTo:"list"
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
