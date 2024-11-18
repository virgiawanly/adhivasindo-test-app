import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { Platform, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/core/services/auth.service';
import { HttpFormattedErrorResponse } from 'src/types/http';
import { LoginForm } from './login-form';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  isLoggingIn: boolean = false;
  loginForm: LoginForm = new LoginForm();

  constructor(
    public platform: Platform,
    private _authService: AuthService,
    private _router: Router,
    private _toastController: ToastController
  ) {
    this.platform.ready().then(() => {
      GoogleAuth.initialize();
    });
  }

  login() {
    this.loginForm.markAllAsTouched();

    if (this.loginForm.invalid && !this.isLoggingIn) {
      return;
    }

    this.isLoggingIn = true;
    this.loginForm.disable();
    this._authService.login(this.loginForm.value).subscribe({
      next: () => {
        this._router.navigateByUrl('/home', {
          replaceUrl: true,
        });
      },
      error: (error: HttpFormattedErrorResponse) => {
        this.isLoggingIn = false;
        this.loginForm.enable();
        this._toastController
          .create({
            message: error.message,
            duration: 3000,
            position: 'bottom',
          })
          .then((toast) => toast.present());
      },
    });
  }
}
