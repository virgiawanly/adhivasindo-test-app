import { FormControl, FormGroup, Validators } from '@angular/forms';

export class RegisterForm extends FormGroup {
  constructor() {
    super({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      password_confirmation: new FormControl('', [Validators.required]),
    });
  }
}
