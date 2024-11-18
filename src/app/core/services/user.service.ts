import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, finalize, map, of } from 'rxjs';
import { AuthService } from './auth.service';
import { HttpService } from './http.service';
import { StorageService } from './storage.service';
import { User } from 'src/types/users';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  /**
   * The user observable.
   *
   * @type BehaviorSubject<User|null>
   */
  private _user$: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);

  /**
   * Status of the user loading.
   *
   * @type BehaviorSubject<boolean>
   */
  private _isLoadingUser$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    private _authService: AuthService,
    private _httpService: HttpService,
    private _storageService: StorageService
  ) {}

  /**
   * Get the user observable.
   *
   * @return BehaviorSubject<User|null>
   */
  get user$() {
    return this._user$.asObservable();
  }

  /**
   * Get the user.
   *
   * @return User|null
   */
  get user() {
    return this._user$.getValue();
  }

  /**
   * Get the status of the user loading observable.
   *
   * @return BehaviorSubject<boolean>
   */
  get isLoadingUser$() {
    return this._isLoadingUser$.asObservable();
  }

  /**
   * Get the status of the user loading.
   *
   * @return boolean
   */
  get isLoadingUser() {
    return this._isLoadingUser$.getValue();
  }

  /**
   * Set the user.
   *
   * @param User|null
   */
  setUser(user: User | null) {
    this._user$.next(user);
  }

  /**
   * Fetch user data from the API.
   *
   * @return void
   */
  loadUserData() {
    const isAuthenticated = this._authService.check();

    if (!isAuthenticated) {
      return;
    }

    // this.loadUserDataFromStorage();
    this.fetchUserDataFromApi().subscribe();
  }

  /**
   * Attempt get user data from storage.
   *
   * @return void
   */
  loadUserDataFromStorage() {
    this._isLoadingUser$.next(true);
    this._storageService.get('lms@user').then((user) => {
      if (user) {
        this.setUser(user);
        this._isLoadingUser$.next(false);
      } else {
        this._isLoadingUser$.next(false);
        this.fetchUserDataFromApi().subscribe();
      }
    });
  }

  /**
   * Remove user data from storage.
   *
   * @return void
   */
  clearUserDataFromStorage() {
    this._storageService.remove('lms@user');
  }

  /**
   * Fetch user data from the API.
   *
   * @return void
   */
  fetchUserDataFromApi() {
    this._isLoadingUser$.next(true);
    return this._httpService.get(`mobile/auth/profile`).pipe(
      finalize(() => this._isLoadingUser$.next(false)),
      map((res: any) => {
        const user = res.data.user;

        this.setUser(user);
        this._storageService.set('lms@user', user);

        return user;
      }),
      catchError((err: any) => {
        this.setUser(null);
        return of(err);
      })
    );
  }
}
