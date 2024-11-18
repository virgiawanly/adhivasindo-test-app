import { HTTP_INTERCEPTORS, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, Observable, switchMap } from 'rxjs';
import { StorageService } from '../services/storage.service';

@Injectable()
export class ApiLanguageInterceptor implements HttpInterceptor {
  constructor(private _storageService: StorageService) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return from(this._storageService.get('lms@lang')).pipe(
      switchMap((lang) => {
        const headers = req.headers.append('X-Localization', lang ?? 'id');
        req = req.clone({ headers, withCredentials: false });

        return next.handle(req);
      })
    );
  }
}

export const apiLanguageInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: ApiLanguageInterceptor, multi: true },
];
