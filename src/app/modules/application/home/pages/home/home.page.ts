import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { UserService } from 'src/app/core/services/user.service';
import { User } from 'src/types/users';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  private _unsubscribeAll$: Subject<void> = new Subject<void>();

  user: User | null = null;

  constructor(private _userService: UserService) {}

  ngOnInit() {
    this._userService.user$.pipe(takeUntil(this._unsubscribeAll$)).subscribe((user) => {
      this.user = user;
    });
  }

  ngOnDestroy() {
    this._unsubscribeAll$.next();
    this._unsubscribeAll$.complete();
  }

  getNameInitials(name?: string) {
    if (!name) {
      return '';
    }

    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('');
  }
}
