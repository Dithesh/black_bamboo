import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatGridListModule} from '@angular/material/grid-list';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule, MatNativeDateModule } from '@angular/material/core';
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



@NgModule({
  declarations: [DatexPipe, SnackbarComponent, ConfirmPopupComponent],
  imports: [
    CommonModule,
    MatSnackBarModule
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
  ],
  providers: [
    SnackService,
    MatSnackBar,
  ]
})
export class SharedModule { }
