import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../../environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from '../components/snackbar/snackbar.component';

@Injectable()
export class SnackService {

  constructor(private _snackBar: MatSnackBar) { }

  openSnackBar(message, action="Close", type="success") {
    let barClass='';
    if(type == 'success'){
      barClass = 'success-snackbar'
    }
    if(type == 'error'){
      barClass = 'error-snackbar'
    }
    if(type == 'info'){
      barClass = 'info-snackbar'
    }
    this._snackBar.open(message, action, {
      duration: 3000,
      panelClass: barClass,
    });
  }
}
