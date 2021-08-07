import { UpdateCategoriesComponent } from './update-categories/update-categories.component';
import { CategoriesListComponent } from './categories-list/categories-list.component';
import { CategoriesSettingComponent } from './categories-setting.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path: "",
    component: CategoriesSettingComponent,
    children: [
      {
        path: "list",
        component: CategoriesListComponent,
        data: {
          module: 'company',
          mode: 'read'
        },
        // canActivate: [ RoleGaurd ]
      },
      {
        path:"update",
        component: UpdateCategoriesComponent,
        data: {
          module: 'company',
          mode: 'full'
        },
        // canActivate: [ RoleGaurd ]
      },
      {
        path:"update/:id",
        component: UpdateCategoriesComponent,
        data: {
          module: 'company',
          mode: 'full'
        },
        // canActivate: [ RoleGaurd ]
      },
      {
        path: "**",
        redirectTo: "list"
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoriesSettingRoutingModule { }
