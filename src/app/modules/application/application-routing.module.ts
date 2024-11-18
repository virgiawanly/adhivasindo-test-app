import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from 'src/app/core/guards/auth.guard';
import { ApplicationLayoutComponent } from 'src/app/shared/layouts/application-layout/application-layout.component';
import { ApplicationLayoutModule } from 'src/app/shared/layouts/application-layout/application-layout.module';

const routes: Routes = [
  {
    path: '',
    component: ApplicationLayoutComponent,
    canActivate: [authGuard],
    loadChildren: () => import('./application-tab-routing.module').then((m) => m.ApplicationTabRoutingModule),
  },
  {
    path: 'courses',
    canActivate: [authGuard],
    loadChildren: () => import('./courses/courses.module').then((m) => m.CoursesModule),
  },
];

@NgModule({
  imports: [ApplicationLayoutModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ApplicationRoutingModule {}
