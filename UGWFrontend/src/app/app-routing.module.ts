import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginGuard} from './guards/login.guard';

const routes: Routes = [
  {
    path: 'setup',
    loadChildren: './modules/setup/setup.module#SetupModule',
    canActivate: [LoginGuard]
  },
  {
    path: 'legal',
    redirectTo: 'setup/legal'
  },
  {
    path: '',
    redirectTo: 'setup/welcome',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
