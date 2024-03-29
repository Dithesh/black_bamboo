import { NgModule, DEFAULT_CURRENCY_CODE } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatGridListModule} from '@angular/material/grid-list';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule, MatNativeDateModule, ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
import {MatSortModule} from '@angular/material/sort';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatMenuModule} from '@angular/material/menu';
import {MatCardModule} from '@angular/material/card';
import { DatexPipe } from './services/datex.pipe';
import {MatSnackBarModule, MatSnackBar} from '@angular/material/snack-bar';
import { SnackbarComponent } from './components/snackbar/snackbar.component';
import { SnackService } from './services/snack.service';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { ConfirmPopupComponent } from './components/confirm-popup/confirm-popup.component';
import {MatBadgeModule} from '@angular/material/badge';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { NumberFormatterDirective } from './services/number-formater.directive';
import { FixedHeaderDirective } from './services/fixed-header.directive';
import { DigitOnlyDirective } from './services/digit-only.directive';
import {  RxReactiveFormsModule } from '@rxweb/reactive-form-validators';
import {MatChipsModule} from '@angular/material/chips';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatSelectFilterModule } from 'mat-select-filter';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MatTooltipModule } from '@angular/material/tooltip';
import {MatTabsModule} from '@angular/material/tabs';
import {MatDialogModule} from '@angular/material/dialog';
import {TableUpdateComponent} from './components/table-update/table-update.component';

@NgModule({
  declarations: [
    DatexPipe,
    SnackbarComponent,
    ConfirmPopupComponent,
    NumberFormatterDirective,
    DigitOnlyDirective,
    FixedHeaderDirective,
    TableUpdateComponent
  ],
  entryComponents: [
    TableUpdateComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatCheckboxModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule
  ],
  exports: [
    MatGridListModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatRippleModule,
    MatSortModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatMenuModule,
    MatCardModule,
    DatexPipe,
    NgxMatSelectSearchModule,
    MatButtonToggleModule,
    MatSlideToggleModule,
    SnackbarComponent,
    ConfirmPopupComponent,
    MatBadgeModule,
    MatExpansionModule,
    MatAutocompleteModule,
    NumberFormatterDirective,
    DigitOnlyDirective,
    RxReactiveFormsModule,
    MatChipsModule,
    MatCheckboxModule,
    MatSelectFilterModule,
    NgxChartsModule,
    MatTooltipModule,
    MatTabsModule,
    FixedHeaderDirective,
    MatDialogModule,
    TableUpdateComponent
  ],
  providers: [
    {provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher},
    {provide: DEFAULT_CURRENCY_CODE, useValue: 'INR'},

  ]
})
export class SharedModule { }
