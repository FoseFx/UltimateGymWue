import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SetupRoutingModule } from './setup-routing.module';
import { WelcomeComponent } from './welcome/welcome.component';
import { LegalComponent } from './legal/legal.component';
import {UiModule} from '../ui/ui.module';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { StufeComponent } from './stufe/stufe.component';
import { KurseComponent } from './kurse/kurse.component';
import {FormsModule} from '@angular/forms';
import {SetupStore} from './state/setup.store';
import {SetupQuery} from './state/setup.query';
import {SetupService} from './state/setup.service';
import { NormalComponent } from './register/normal/normal.component';
import {RegistersteptwoGuard} from './guards/registersteptwo.guard';
import {HttpClientModule} from '@angular/common/http';
import {LoginService} from './login/login.service';
@NgModule({
  declarations: [WelcomeComponent, LegalComponent, LoginComponent, RegisterComponent, StufeComponent, KurseComponent, NormalComponent],
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
    LoginService
  ]
})
export class SetupModule { }
