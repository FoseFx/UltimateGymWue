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

@NgModule({
  declarations: [WelcomeComponent, LegalComponent, LoginComponent, RegisterComponent, StufeComponent, KurseComponent],
  imports: [
    CommonModule,
    FormsModule,
    SetupRoutingModule,
    UiModule
  ],
  providers: [
    SetupStore,
    SetupQuery,
    SetupService
  ]
})
export class SetupModule { }
