import { HttpErrorResponse } from "@angular/common/http";
import { SnackbarService } from "../services/snackbar.service";
import { inject, Injector } from "@angular/core";
import { catchError, of } from "rxjs";
import { MatSnackBar } from "@angular/material/snack-bar";

export function GenericErrorHandler(message: string = 'An error occured') {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      const snackbarService = (this as any).snackbarService;
      return originalMethod.apply(this, args).pipe(
        catchError((error) => {
          console.error(`Error in ${propertyKey}:`, error);
          let errorMessage = message;
          if (error instanceof HttpErrorResponse) {
            // Try to extract error message from the HTTP error response
            if (error.error && error.error.message) {
              errorMessage = error.error.message;
            } else if (error.status === 0) {
              errorMessage = 'No connection. Please check your internet.';
            } else if (error.status === 500) {
              errorMessage = 'Internal server error. Please try again later.';
            } else {
              errorMessage = `Error ${error.status}: ${error.statusText}`;
            }
          } else if (error instanceof Error) {
            errorMessage = error.message || message; // If it's a general JS error, use its message
          }

          snackbarService.open(errorMessage, 'Close', 3000);

          throw of(null);
        })
      );
    };

    return descriptor;
  }
}