import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { NgIconsModule } from '@ng-icons/core';
import { lucideCirclePlay, lucideSearch } from '@ng-icons/lucide';
import { TranslateModule } from '@ngx-translate/core';
import { HomePageRoutingModule } from './home-routing.module';
import { HomePage } from './home.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    TranslateModule,
    RouterLink,
    NgIconsModule.withIcons({
      lucideSearch,
      lucideCirclePlay,
    }),
  ],
  declarations: [HomePage],
})
export class HomePageModule {}
