import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  /**
   * The dark mode observable.
   *
   * @type BehaviorSubject<boolean>
   */
  private _isDarkMode$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private _storageService: StorageService) {
    // Load the dark mode from the storage.
    this._storageService.get('lms@darkMode').then((isDarkMode) => {
      this._isDarkMode$.next(isDarkMode);
    });
  }

  /**
   * Set dark mode configuration.
   *
   * @param {boolean} isDarkMode
   * @returns void
   */
  setDarkMode(isDarkMode: boolean) {
    this._isDarkMode$.next(isDarkMode);
    this._storageService.set('lms@darkMode', isDarkMode);
  }

  /**
   * Get the dark mode observable.
   *
   * @return BehaviorSubject<boolean>
   */
  get isDarkMode$() {
    return this._isDarkMode$.asObservable();
  }

  /**
   * Get the dark mode current value.
   *
   * @return boolean
   */
  get isDarkMode() {
    return this._isDarkMode$.getValue();
  }
}
