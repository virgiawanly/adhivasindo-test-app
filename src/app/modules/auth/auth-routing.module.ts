import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { noAuthGuard } from 'src/app/core/guards/no-auth.guard';

const routes: Routes = [
  {
    path: 'login',
    canActivate: [noAuthGuard],
    loadChildren: () => import('./login/login.module').then((m) => m.LoginModule),
  },
  {
    path: 'registration',
    canActivate: [noAuthGuard],
    loadChildren: () => import('./registration/registration.module').then((m) => m.RegistrationModule),
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
