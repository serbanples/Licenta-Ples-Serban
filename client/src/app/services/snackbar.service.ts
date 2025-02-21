import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  constructor(private snackBar: MatSnackBar) {}

  open(message: string, action: string = 'Close', duration: number = 3000): MatSnackBarRef<SimpleSnackBar> {
    return this.snackBar.open(message, action, {
      duration,
      verticalPosition: 'top',
      panelClass: ['error-snackbar'],
    });
  }

  close(snackbarRef: MatSnackBarRef<SimpleSnackBar>) {
    snackbarRef.dismiss();
  }
}
