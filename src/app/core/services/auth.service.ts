import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, from, of, switchMap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _isAuthenticated = new BehaviorSubject<boolean>(false);
  private _isInitialized = new BehaviorSubject<boolean>(false);

  constructor(
    private _http: HttpClient,
    private _storageService: StorageService
  ) {
    this._initializeAuthState();
  }

  private async _initializeAuthState(): Promise<void> {
    try {
      const token = await this._storageService.get(environment.access_token_identifier);
      this._isAuthenticated.next(!!token);
    } catch (error) {
      console.error('Failed to initialize auth state', error);
      this._isAuthenticated.next(false);
    } finally {
      this._isInitialized.next(true);
    }
  }

  private async _setTokens(accessToken: string | null, refreshToken: string | null): Promise<void> {
    try {
      if (accessToken) {
        await this._storageService.set(environment.access_token_identifier, accessToken);
      } else {
        await this._storageService.remove(environment.access_token_identifier);
      }

      if (refreshToken) {
        await this._storageService.set(environment.refresh_token_identifier, refreshToken);
      } else {
        await this._storageService.remove(environment.refresh_token_identifier);
      }
    } catch (error) {
      console.error('Failed to set tokens', error);
    }
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this._http
      .post<{
        data: { access_token: string; refresh_token: string };
      }>(`${environment.api_url}/mobile/auth/login`, credentials)
      .pipe(
        switchMap((res) => {
          const { access_token, refresh_token } = res.data;
          return from(this._setTokens(access_token, refresh_token)).pipe(
            switchMap(() => {
              this._isAuthenticated.next(true);
              return of(res);
            })
          );
        }),
        catchError((err) => {
          console.error('Login failed', err);
          return throwError(() => err);
        })
      );
  }

  loginUsingToken(accessToken: string | null, refreshToken: string | null): Observable<boolean> {
    return from(this._setTokens(accessToken, refreshToken)).pipe(
      switchMap(() => {
        this._isAuthenticated.next(!!accessToken);
        return of(true);
      })
    );
  }

  refreshAccessToken(): Observable<string> {
    return from(this._storageService.get(environment.refresh_token_identifier)).pipe(
      switchMap((refreshToken) => {
        if (!refreshToken) {
          this.logout();
          return throwError(() => new Error('No refresh token available.'));
        }

        return this._http
          .post<{ data: { accessToken: string } }>(`${environment.api_url}/auth/refresh`, { refreshToken })
          .pipe(
            switchMap((res) => {
              const { accessToken } = res.data;

              // Only update the access token, keep the refresh token
              return from(this._storageService.set(environment.access_token_identifier, accessToken)).pipe(
                switchMap(() => {
                  this._isAuthenticated.next(true);
                  return of(accessToken);
                })
              );
            }),
            catchError((err) => {
              console.error('Failed to refresh access token', err);
              this.logout();
              return throwError(() => err);
            })
          );
      })
    );
  }

  logout(): void {
    this._setTokens(null, null).then(() => {
      this._isAuthenticated.next(false);
      this._isInitialized.next(false);
    });
  }

  check(): boolean {
    return this._isAuthenticated.getValue();
  }

  observe(): Observable<boolean> {
    return this._isAuthenticated.asObservable();
  }

  isInitialized(): Observable<boolean> {
    return this._isInitialized.asObservable();
  }
}
