import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-application-layout',
  templateUrl: './application-layout.component.html',
  styleUrls: ['./application-layout.component.scss'],
})
export class ApplicationLayoutComponent implements OnInit, OnDestroy {
  private _unsubscribeAll$: Subject<void> = new Subject<void>();

  constructor(
    private _authService: AuthService,
    private _userService: UserService
  ) {}

  ngOnInit() {
    this._authService
      .observe()
      .pipe(takeUntil(this._unsubscribeAll$))
      .subscribe((authenticated) => {
        if (authenticated) {
          this._userService.loadUserData();
        }
      });
  }

  ngOnDestroy() {
    this._unsubscribeAll$.next();
    this._unsubscribeAll$.complete();
  }
}
