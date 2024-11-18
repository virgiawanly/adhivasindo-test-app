import { HTTP_INTERCEPTORS, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { HttpFormattedErrorResponse } from 'src/types/http';

@Injectable()
export class FormatErrorInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(
      catchError((error: any) => {
        const formattedError: HttpFormattedErrorResponse = {
          error: true,
          message: '',
          errors: [],
        };

        if (error.error instanceof ErrorEvent) {
          formattedError.message = 'Something went wrong. Please try again.';
        } else {
          formattedError.status = error.status;
          formattedError.errors = error.error?.errors || [];
          formattedError.message =
            error.error?.message || error.error_message || error.message || 'Something went wrong. Please try again.';
        }

        return throwError(() => formattedError);
      })
    );
  }
}

export const formatErrorInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: FormatErrorInterceptor, multi: true },
];
