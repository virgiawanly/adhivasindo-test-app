import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, finalize, from, of, switchMap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _isAuthenticated = new BehaviorSubject(false);
  private _isInitialized = new BehaviorSubject(false);

  constructor(
    private _http: HttpClient,
    private _storageService: StorageService
  ) {
    // Check if the user is authenticated by checking the token.
    this._storageService.get(environment.access_token_identifier).then((token) => {
      if (token) {
        this._isAuthenticated.next(true);
      }

      this._isInitialized.next(true);
    });
  }

  /**
   * Set the API token in the storage.
   *
   * @param {string | null} accessToken
   * @returns Promise<any>
   */
  async setApiToken(accessToken: string | null, refreshToken: string | null = null) {
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

  /**
   * Verify the user phone number and send OTP code.
   *
   * @param {Object} credentials
   * @param {string} credentials.email
   * @param {string} credentials.password
   * @returns Observable<any>
   */
  login(credentials: { email: string; password: string }): Observable<any> {
    return this._http.post(`${environment.api_url}/mobile/auth/login`, credentials).pipe(
      switchMap((res: any) => {
        const { access_token, refresh_token } = res.data;
        this.setApiToken(access_token, refresh_token);
        this._isAuthenticated.next(!!access_token);

        return of(res);
      })
    );
  }

  refreshAccessToken(): Observable<string> {
    return from(this._storageService.get(environment.refresh_token_identifier)).pipe(
      switchMap((refreshToken) => {
        this._isInitialized.next(false);

        if (!refreshToken) {
          this.logout();
          return throwError(() => new Error('No refresh token available.'));
        }

        return this._http
          .post<{
            data: { accessToken: string };
          }>(`${environment.api_url}/mobile/auth/refresh`, { refresh_token: refreshToken })
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
              return throwError(() => err);
            }),
            finalize(() => {
              this._isInitialized.next(false);
            })
          );
      })
    );
  }

  /**
   * Login the user using the token.
   *
   * @param {string} accessToken
   * @param {string} refreshToken
   * @returns Observable<any>
   */
  loginUsingToken(accessToken: string, refreshToken: string): Observable<any> {
    return from(
      new Promise((resolve) => {
        this.setApiToken(accessToken, refreshToken).then(() => {
          this._isAuthenticated.next(true);
          resolve(true);
        });
      })
    );
  }

  /**
   * Logout the user.
   *
   * @returns Observable<boolean>
   */
  logout(): Observable<boolean> {
    this.setApiToken(null);
    this._isAuthenticated.next(false);
    return from(this._storageService.remove(environment.access_token_identifier)).pipe(
      switchMap(() => of(true)) // Return `true` to indicate successful logout
    );
  }

  /**
   * Check if the user is authenticated.
   *
   * @return boolean
   */
  check(): boolean {
    return this._isAuthenticated.getValue();
  }

  /**
   * Observe the authentication status.
   *
   * @return Observable<boolean>
   */
  observe(): Observable<boolean> {
    return this._isAuthenticated.asObservable();
  }

  /**
   * Check if the service is initialized.
   *
   * @return Observable<boolean>
   */
  isInitialized(): Observable<boolean> {
    return this._isInitialized.asObservable();
  }
}
