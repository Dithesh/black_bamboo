import { SharedModule } from 'src/app/shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriesListComponent } from './categories-list/categories-list.component';
import { UpdateCategoriesComponent } from './update-categories/update-categories.component';
import { CategoriesSettingRoutingModule } from './categories-setting-routing.module';


@NgModule({
  declarations: [CategoriesListComponent, UpdateCategoriesComponent],
  imports: [
    CommonModule,
    CategoriesSettingRoutingModule,
    SharedModule
  ]
})
export class CategoriesSettingModule { }