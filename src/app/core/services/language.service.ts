import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import { StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  /**
   * List of available languages.
   *
   * @type {string[]}
   */
  public languages: string[] = ['id', 'en'];

  /**
   * The language observable.
   *
   * @type {BehaviorSubject<string>}
   */
  private _language$: BehaviorSubject<string> = new BehaviorSubject<string>('id');

  constructor(
    public translate: TranslateService,
    private _storageService: StorageService
  ) {
    // Add languages to translate service
    this.translate.addLangs(this.languages);

    // Set default language
    this._storageService.get('lms@lang').then((lang) => {
      let storageLang: any = lang ? lang : 'id';
      this._language$.next(storageLang?.match(/id|en/) ? storageLang : 'id');
    });
  }

  /**
   * Get the language observable.
   *
   * @return {BehaviorSubject<string>}
   */
  get language$() {
    return this._language$.asObservable();
  }

  /**
   * Get the current language.
   *
   * @return {string}
   */
  get language() {
    return this._language$.getValue();
  }

  /***
   * Set language and save in cookie.
   *
   * @param  lang any
   * @return void
   */
  public setLanguage(lang: any) {
    this._language$.next(lang);
    this._storageService.set('lms@lang', lang);
  }
}
