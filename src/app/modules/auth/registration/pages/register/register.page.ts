import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Platform, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/core/services/auth.service';
import { HttpService } from 'src/app/core/services/http.service';
import { HttpFormattedErrorResponse } from 'src/types/http';
import { RegisterForm } from './register-form';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  isSubmitting: boolean = false;
  registerForm: RegisterForm = new RegisterForm();

  constructor(
    public platform: Platform,
    private _httpService: HttpService,
    private _authService: AuthService,
    private _router: Router,
    private _toastController: ToastController
  ) {}

  submit() {
    this.registerForm.markAllAsTouched();

    if (this.registerForm.invalid || this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;
    this.registerForm.disable();
    this._httpService
      .post('mobile/auth/register', this.registerForm.value)
      .subscribe({
        next: (res: any) => {
          const accessToken = res.data.access_token;
          const refreshToken = res.data.access_token;

          if (accessToken) {
            this._authService.loginUsingToken(accessToken, refreshToken).subscribe({
              next: () => {
                this._toastController
                  .create({
                    message: res.message,
                    duration: 3000,
                    position: 'bottom',
                  })
                  .then((toast) => {
                    toast.present();
                    this._router.navigateByUrl('/home', { replaceUrl: true });
                  });
              },
            });
          } else {
            console.error('NO TOKEN RETURNED AFTER REGISTRATION');
          }
        },
        error: (error: HttpFormattedErrorResponse) => {
          this._toastController
            .create({
              message: error.message,
              duration: 3000,
              position: 'bottom',
            })
            .then((toast) => toast.present());
        },
      })
      .add(() => {
        this.isSubmitting = false;
        this.registerForm.enable();
      });
  }
}
