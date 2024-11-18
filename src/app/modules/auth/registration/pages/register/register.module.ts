import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NgIconsModule } from '@ng-icons/core';
import { lucideLock, lucideMail, lucideUser } from '@ng-icons/lucide';
import { TranslateModule } from '@ngx-translate/core';
import { RegisterPageRoutingModule } from './register-routing.module';
import { RegisterPage } from './register.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RegisterPageRoutingModule,
    TranslateModule.forChild({ extend: true }),
    NgIconsModule.withIcons({
      lucideUser,
      lucideMail,
      lucideLock,
    }),
  ],
  declarations: [RegisterPage],
})
export class RegisterPageModule {}
