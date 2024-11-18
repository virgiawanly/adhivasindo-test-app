import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { NgIconsModule } from '@ng-icons/core';
import { lucideBookMarked, lucideBookOpen, lucideHouse, lucideSettings } from '@ng-icons/lucide';
import { TranslateModule } from '@ngx-translate/core';
import { ApplicationLayoutComponent } from './application-layout.component';

@NgModule({
  declarations: [ApplicationLayoutComponent],
  imports: [
    CommonModule,
    IonicModule,
    TranslateModule,
    NgIconsModule.withIcons({
      lucideHouse,
      lucideSettings,
      lucideBookOpen,
      lucideBookMarked,
    }),
  ],
  exports: [ApplicationLayoutComponent],
})
export class ApplicationLayoutModule {}
