import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin.component';


const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.module').then(mod => mod.DashboardModule)
      },
      {
        path: 'branch-profile',
        loadChildren: () => import('./branch-profile/branch-profile.module').then(mod => mod.BranchProfileModule)
      },
      {
        path: 'order',
        loadChildren: () => import('./orders/orders.module').then(mod => mod.OrdersModule)
      },
      {
        path : 'settings',
        loadChildren: () => import('./settings/settings.module').then(mod => mod.SettingsModule)
      },
      {
        path: 'products',
        loadChildren: () => import('./products/products.module').then(mod => mod.ProductsModule)
      },
      {
        path: 'product-combo',
        loadChildren: () => import('./product-combo/product-combo.module').then(mod => mod.ProductComboModule)
      },
      {
        path: 'favorite-menu',
        loadChildren: () => import('./favorite-product/favorite-product.module').then(mod => mod.FavoriteProductModule)
      },
      {
        path: 'tables',
        loadChildren: () => import('./table-manager/table-manager.module').then(mod => mod.TableManagerModule)
      },
      {
        path: 'reports',
        loadChildren: () => import('./report-manager/report-manager.module').then(mod => mod.ReportManagerModule)
      },
      {
        path: 'user',
        loadChildren: () => import('./user/user.module').then(mod => mod.UserModule)
      },
      {
        path: 'account-management',
        loadChildren: () => import('./account-management/account-management.module').then(mod => mod.AccountManagementModule)
      },
      {
        path: 'categories',
        loadChildren: () => import('./categories-setting/categories-setting.module').then(m => m.CategoriesSettingModule)
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
