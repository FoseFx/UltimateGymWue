import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WelcomeComponent } from './welcome/welcome.component';
import { LegalComponent } from './legal/legal.component';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {NormalComponent} from './register/normal/normal.component';
import {RegistersteptwoGuard} from './guards/registersteptwo.guard';
import {LoginGuard} from './guards/login.guard';
import {StufeComponent} from './stufe/stufe.component';
import {LoginnedGuard} from './guards/loginned.guard';
import {GoogleComponent} from './register/google/google.component';
import {GoogleLoginComponent} from './login/google-login/google-login.component';
import {InstaComponent} from './register/insta/insta.component';
import {InstaLoginComponent} from './login/insta-login/insta-login.component';

const routes: Routes = [
  {
    path: 'legal',
    component: LegalComponent
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [LoginGuard]
  },
  {
    path: 'login/google',
    component: GoogleLoginComponent,
    canActivate: [LoginGuard]
  },
  {
    path: 'login/insta',
    component: InstaLoginComponent,
    canActivate: [LoginGuard]
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [LoginGuard]
  },
  {
    path: 'register/normal',
    component: NormalComponent,
    canActivate: [RegistersteptwoGuard]
  },
  {
    path: 'register/google',
    component: GoogleComponent,
    canActivate: [RegistersteptwoGuard]
  },
  {
    path: 'register/insta',
    component: InstaComponent,
    canActivate: [RegistersteptwoGuard]
  },
  {
    path: 'welcome',
    component: WelcomeComponent,
    canActivate: [LoginGuard]
  },
  {
    path: 'basics',
    redirectTo: 'basics/stufe'
  },
  {
    path: 'basics/stufe',
    component: StufeComponent,
    canActivate: [LoginnedGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SetupRoutingModule { }
