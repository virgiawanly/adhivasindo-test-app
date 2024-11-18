import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApplicationLayoutModule } from 'src/app/shared/layouts/application-layout/application-layout.module';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/pages/home/home.module').then((m) => m.HomePageModule),
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },
];

@NgModule({
  imports: [ApplicationLayoutModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ApplicationTabRoutingModule {}
