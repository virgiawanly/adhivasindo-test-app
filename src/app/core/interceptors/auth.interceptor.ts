import {
  HTTP_INTERCEPTORS,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, from, switchMap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { StorageService } from '../services/storage.service';
import { AuthService } from '../services/auth.service';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: Observable<string> | null = null;

  constructor(
    private _storageService: StorageService,
    private _authService: AuthService,
    private _toastController: ToastController,
    private _router: Router
  ) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return from(this._storageService.get(environment.access_token_identifier)).pipe(
      switchMap((token) => {
        if (token) {
          const headers = req.headers.append('Authorization', `Bearer ${token}`);
          req = req.clone({ headers });
        }

        return next.handle(req).pipe(
          catchError((error: HttpErrorResponse) => {
            // Check for 401 Unauthorized and refresh token if necessary
            if (error.status === 401) {
              return this.handle401Error(req, next);
            }

            return throwError(() => error);
          })
        );
      })
    );
  }

  private handle401Error(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject = this._authService.refreshAccessToken();

      return this.refreshTokenSubject.pipe(
        switchMap((newAccessToken) => {
          this.isRefreshing = false;
          this.refreshTokenSubject = null;

          // Retry the failed request with the new access token
          const headers = req.headers.set('Authorization', `Bearer ${newAccessToken}`);
          const clonedRequest = req.clone({ headers });
          return next.handle(clonedRequest);
        }),
        catchError((err) => {
          this.isRefreshing = false;
          this._authService.logout(); // Logout if refresh token fails
          this._toastController
            .create({
              message: 'Your session has expired. Please login again.',
              duration: 3000,
              position: 'bottom',
            })
            .then((toast) => {
              toast.present();
              this._router.navigate(['/auth/login']);
            });
          return throwError(() => err);
        })
      );
    }

    // Wait for the token refresh to complete
    return this.refreshTokenSubject
      ? this.refreshTokenSubject.pipe(
          switchMap((newAccessToken) => {
            const headers = req.headers.set('Authorization', `Bearer ${newAccessToken}`);
            const clonedRequest = req.clone({ headers });
            return next.handle(clonedRequest);
          })
        )
      : throwError(() => new Error('Token refresh is already in progress.'));
  }
}

export const authInterceptorProviders = [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }];
