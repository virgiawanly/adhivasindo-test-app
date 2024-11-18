import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CourseDetailPageRoutingModule } from './course-detail-routing.module';

import { NgIconsModule } from '@ng-icons/core';
import { lucideBook, lucideChevronLeft, lucideCirclePlay, lucideUsers } from '@ng-icons/lucide';
import { TranslateModule } from '@ngx-translate/core';
import { CourseDetailPage } from './course-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NgIconsModule.withIcons({
      lucideChevronLeft,
      lucideBook,
      lucideUsers,
      lucideCirclePlay,
    }),
    TranslateModule,
    CourseDetailPageRoutingModule,
  ],
  declarations: [CourseDetailPage],
})
export class CourseDetailPageModule {}
