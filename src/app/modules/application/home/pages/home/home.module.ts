import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { NgIconsModule } from '@ng-icons/core';
import { lucideBook, lucideCirclePlay, lucideSearch, lucideUsers } from '@ng-icons/lucide';
import { TranslateModule } from '@ngx-translate/core';
import { HomePageRoutingModule } from './home-routing.module';
import { HomePage } from './home.page';
import { SwiperDirective } from 'src/app/shared/directives/swiper.directive';
import { register } from 'swiper/element/bundle';

register();

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SwiperDirective,
    HomePageRoutingModule,
    TranslateModule,
    RouterLink,
    NgIconsModule.withIcons({
      lucideSearch,
      lucideCirclePlay,
      lucideBook,
      lucideUsers,
    }),
  ],
  declarations: [HomePage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomePageModule {}
