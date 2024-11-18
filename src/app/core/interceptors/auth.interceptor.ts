import {
  HTTP_INTERCEPTORS,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { BehaviorSubject, catchError, from, Observable, switchMap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../services/auth.service';
import { StorageService } from '../services/storage.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject = new BehaviorSubject<string | null>(null);

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
          req = req.clone({
            setHeaders: { Authorization: `Bearer ${token}` },
          });
        }

        return next.handle(req).pipe(
          catchError((error: HttpErrorResponse) => {
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
      this.refreshTokenSubject.next(null);

      return this._authService.refreshAccessToken().pipe(
        switchMap((newAccessToken) => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(newAccessToken);

          req = req.clone({
            setHeaders: { Authorization: `Bearer ${newAccessToken}` },
          });

          return next.handle(req);
        }),
        catchError((err) => {
          this._authService.logout().subscribe(() => {
            this.isRefreshing = false;
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
          });

          return throwError(() => err);
        })
      );
    }

    return this.refreshTokenSubject.pipe(
      switchMap((newAccessToken) => {
        if (newAccessToken) {
          req = req.clone({
            setHeaders: { Authorization: `Bearer ${newAccessToken}` },
          });

          return next.handle(req);
        }

        return throwError(() => new Error('Token refresh failed.'));
      })
    );
  }
}

export const authInterceptorProviders = [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }];
