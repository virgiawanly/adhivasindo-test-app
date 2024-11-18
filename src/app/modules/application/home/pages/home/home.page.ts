import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, RefresherCustomEvent, ToastController } from '@ionic/angular';
import { finalize, Subject, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { HttpService } from 'src/app/core/services/http.service';
import { UserService } from 'src/app/core/services/user.service';
import { Course } from 'src/types/courses';
import { User } from 'src/types/users';
import { SwiperOptions } from 'swiper/types';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  private _unsubscribeAll$: Subject<void> = new Subject<void>();

  user: User | null = null;
  isLoading: boolean = false;
  isInitialLoaded: boolean = false;

  popularCourses: Course[] = [];
  popularCoursesSwiperConfig: SwiperOptions = {
    slidesPerView: 1.8,
    spaceBetween: 14,
    breakpoints: {
      0: { slidesPerView: 1.8, spaceBetween: 14 },
      640: { slidesPerView: 2, spaceBetween: 18 },
      768: { slidesPerView: 3, spaceBetween: 20 },
      1024: { slidesPerView: 4, spaceBetween: 24 },
    },
  };

  recentlyAddedCourses: Course[] = [];
  recentlyAddedCoursesSwiperConfig: SwiperOptions = {
    slidesPerView: 1.8,
    spaceBetween: 14,
    breakpoints: {
      0: { slidesPerView: 1.8, spaceBetween: 14 },
      640: { slidesPerView: 2, spaceBetween: 18 },
      768: { slidesPerView: 3, spaceBetween: 20 },
      1024: { slidesPerView: 4, spaceBetween: 24 },
    },
  };

  recentlyAccessedCourses: Course[] = [];
  recentlyAccessedCoursesSwiperConfig: SwiperOptions = {
    slidesPerView: 1.8,
    spaceBetween: 14,
    breakpoints: {
      0: { slidesPerView: 1.5, spaceBetween: 14 },
      640: { slidesPerView: 1.8, spaceBetween: 18 },
      768: { slidesPerView: 2.5, spaceBetween: 20 },
      1024: { slidesPerView: 3.5, spaceBetween: 24 },
    },
  };

  constructor(
    private _userService: UserService,
    private _httpService: HttpService,
    private _toastController: ToastController,
    private _alertController: AlertController,
    private _authService: AuthService,
    private _router: Router
  ) {}

  ngOnInit() {
    this.setupHomepage();

    this._userService.user$.pipe(takeUntil(this._unsubscribeAll$)).subscribe((user) => {
      this.user = user;
    });
  }

  ngOnDestroy() {
    this._unsubscribeAll$.next();
    this._unsubscribeAll$.complete();
  }

  setupHomepage() {
    return new Promise((resolve, reject) => {
      this.isLoading = true;
      this._httpService
        .get('mobile/homepage', {
          params: {
            size: 5,
          },
        })
        .pipe(
          finalize(() => {
            this.isLoading = false;
            this.isInitialLoaded = true;
          })
        )
        .subscribe({
          next: (res: any) => {
            this.popularCourses = res.data.popular_courses?.data ?? [];
            this.recentlyAddedCourses = res.data.recently_added_courses?.data ?? [];
            this.recentlyAccessedCourses = res.data.user_recently_accessed_courses?.data ?? [];
            resolve(res);
          },
          error: (err) => {
            this._toastController
              .create({
                message: 'Failed to load courses',
                duration: 2000,
                position: 'bottom',
              })
              .then((toast) => toast.present());
            reject(err);
          },
        });
    });
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

  refreshPage(event: RefresherCustomEvent) {
    this.setupHomepage().finally(() => {
      event.target.complete();
    });
  }

  openLogoutConfirmation() {
    this._alertController
      .create({
        header: 'Logout',
        message: 'Are you sure you want to logout?',
        buttons: [
          { text: 'Cancel', role: 'cancel' },
          {
            text: 'Logout',
            handler: () => {
              this.logout();
            },
          },
        ],
      })
      .then((alert) => {
        alert.present();
      });
  }

  logout() {
    this._authService.logout().subscribe(() => {
      this._userService.clearUserDataFromStorage();

      if (window && window.location) {
        window.location.reload();
      }

      // this._router.navigateByUrl('/auth/login', {
      //   replaceUrl: true,
      // });
    });
  }
}
