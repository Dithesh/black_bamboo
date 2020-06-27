import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../../environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from '../components/snackbar/snackbar.component';

@Injectable()
export class SnackService {
    
  constructor(private _snackBar: MatSnackBar) { }

  openSnackBar(message, action="Close") {
    this._snackBar.open(message, action, {
      duration: 3000,
    });
  }
}
