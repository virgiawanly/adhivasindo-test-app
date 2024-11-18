import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { LanguageService } from './core/services/language.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  private _languageSubscription$?: Subscription;

  constructor(
    private _languageService: LanguageService,
    private _translateService: TranslateService
  ) {}

  ngOnInit() {
    // Set default language
    this._translateService.setDefaultLang('id');

    // Subscribe for app language change
    this._languageSubscription$ = this._languageService.language$.subscribe((language) => {
      if (language) {
        this._translateService.use(language?.match(/id|en/) ? language : 'id');
      }
    });
  }

  ngOnDestroy() {
    if (this._languageSubscription$) {
      this._languageSubscription$.unsubscribe();
    }
  }
}
