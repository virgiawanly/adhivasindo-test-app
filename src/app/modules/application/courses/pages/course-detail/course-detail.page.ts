import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RefresherCustomEvent, ToastController } from '@ionic/angular';
import { finalize } from 'rxjs';
import { HttpService } from 'src/app/core/services/http.service';
import { Course } from 'src/types/courses';
import { HttpFormattedErrorResponse } from 'src/types/http';

@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.page.html',
  styleUrls: ['./course-detail.page.scss'],
})
export class CourseDetailPage implements OnInit {
  // Course Details
  isLoading: boolean = false;
  courseId: string | null = null;
  course: Course | null = null;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _location: Location,
    private _httpService: HttpService,
    private _toastController: ToastController,
    private _router: Router
  ) {
    this.courseId = this._activatedRoute.snapshot.paramMap.get('id');
  }

  ngOnInit() {
    if (this.courseId) {
      this.getCourse();
    } else {
      this.back();
    }
  }

  getCourse() {
    return new Promise((resolve, reject) => {
      this.isLoading = true;
      this._httpService
        .get(`mobile/courses/${this.courseId}`, {
          params: {
            relations: 'chapters,chapters.lessons',
          },
        })
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe({
          next: (res: any) => {
            this.course = res.data ?? null;
            resolve(res);
          },
          error: (err: HttpFormattedErrorResponse) => {
            this._toastController
              .create({
                message: err.message ?? 'Failed to get course.',
                duration: 3000,
                position: 'bottom',
              })
              .then((toast) => {
                toast.present();
                this._router.navigateByUrl('/', { replaceUrl: true });
              });
            reject(err);
          },
        });
    });
  }

  refreshPage(event: RefresherCustomEvent) {
    this.getCourse().finally(() => event.target.complete());
  }

  back() {
    this._location.back();
  }
}
