import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {WelcomeComponent} from './welcome/welcome.component';
import {LegalComponent} from './legal/legal.component';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {NormalComponent} from './register/normal/normal.component';
import {RegistersteptwoGuard} from './guards/registersteptwo.guard';
import {LoginGuard} from './guards/login.guard';
import {StufeComponent} from './stufe/stufe.component';
import {LoginnedGuard} from './guards/loginned.guard';
import {CredentialsComponent} from './credentials/credentials.component';
import {HasCredsGuard} from './guards/has-creds.guard';
import {KurseComponent} from './kurse/kurse.component';
import {HasStufeGuard} from './guards/has-stufe.guard';
import {KlausurenComponent} from './klausuren/klausuren.component';
import {HasKurseGuard} from './guards/has-kurse.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'welcome'
  },
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
    path: 'welcome',
    component: WelcomeComponent,
    canActivate: [LoginGuard]
  },
  {
    path: 'basics',
    redirectTo: 'basics/creds'
  },
  {
    path: 'basics/creds',
    component: CredentialsComponent,
    canActivate: [LoginnedGuard]
  },
  {
    path: 'basics/stufe',
    component: StufeComponent,
    canActivate: [LoginnedGuard, HasCredsGuard]
  },
  {
    path: 'basics/kurse',
    component: KurseComponent,
    canActivate: [LoginnedGuard, HasCredsGuard, HasStufeGuard]
  },
  {
    path: 'basics/klausuren',
    component: KlausurenComponent,
    canActivate: [LoginnedGuard, HasCredsGuard, HasKurseGuard]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SetupRoutingModule { }
