import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SetupRoutingModule} from './setup-routing.module';
import {WelcomeComponent} from './welcome/welcome.component';
import {LegalComponent} from './legal/legal.component';
import {UiModule} from '../ui/ui.module';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {StufeComponent} from './stufe/stufe.component';
import {KurseComponent} from './kurse/kurse.component';
import {FormsModule} from '@angular/forms';
import {SetupStore} from './state/setup.store';
import {SetupQuery} from './state/setup.query';
import {SetupService} from './state/setup.service';
import {NormalComponent} from './register/normal/normal.component';
import {RegistersteptwoGuard} from './guards/registersteptwo.guard';
import {HttpClientModule} from '@angular/common/http';
import {LoginService} from './login/login.service';
import {LoginGuard} from './guards/login.guard';
import {LoginnedGuard} from './guards/loginned.guard';
import {GoogleComponent, GoogleSigninComponent} from './register/google/google.component';
import {GoogleLoginComponent} from './login/google-login/google-login.component';
import {InstaComponent} from './register/insta/insta.component';
import {InstaLoginComponent} from './login/insta-login/insta-login.component';
import {CredentialsComponent} from './credentials/credentials.component';
import {HasCredsGuard} from './guards/has-creds.guard';
import {HasStufeGuard} from './guards/has-stufe.guard';
import {KurseSelectRowComponent} from './kurse/kurse-select-row/kurse-select-row.component';
import {StundenplanService} from './services/stundenplan.service';
import {KlausurenComponent} from './klausuren/klausuren.component';
import {HasKurseGuard} from './guards/has-kurse.guard';

@NgModule({
  declarations: [
    WelcomeComponent,
    LegalComponent,
    LoginComponent,
    RegisterComponent,
    StufeComponent,
    KurseComponent,
    NormalComponent,
    GoogleComponent,
    GoogleSigninComponent,
    GoogleLoginComponent,
    InstaComponent,
    InstaLoginComponent,
    CredentialsComponent,
    KurseSelectRowComponent,
    KlausurenComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SetupRoutingModule,
    HttpClientModule,
    UiModule
  ],
  providers: [
    SetupStore,
    SetupQuery,
    SetupService,
    RegistersteptwoGuard,
    LoginService,
    LoginGuard,
    LoginnedGuard,
    HasCredsGuard,
    HasStufeGuard,
    StundenplanService,
    HasKurseGuard
  ]
})
export class SetupModule { }
