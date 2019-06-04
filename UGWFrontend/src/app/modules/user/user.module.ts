import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user/user.component';
import {UiModule} from '../ui/ui.module';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [UserComponent],
  imports: [
    CommonModule,
    UserRoutingModule,
    UiModule,
    HttpClientModule
  ]
})
export class UserModule { }
