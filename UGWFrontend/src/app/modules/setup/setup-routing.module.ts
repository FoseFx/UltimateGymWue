import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WelcomeComponent } from './welcome/welcome.component';
import { LegalComponent } from './legal/legal.component';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {NormalComponent} from './register/normal/normal.component';
import {RegistersteptwoGuard} from './guards/registersteptwo.guard';

const routes: Routes = [
  {
    path: 'legal',
    component: LegalComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'register/normal',
    component: NormalComponent,
    canActivate: [RegistersteptwoGuard]
  },
  {
    path: 'welcome',
    component: WelcomeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SetupRoutingModule { }
