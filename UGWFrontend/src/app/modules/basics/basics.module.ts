import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingComponent } from './components/landing/landing.component';
import {BasicsRoutingModule} from './basics-routing.module';

@NgModule({
  declarations: [LandingComponent],
  imports: [
    CommonModule,
    BasicsRoutingModule
  ]
})
export class BasicsModule { }
