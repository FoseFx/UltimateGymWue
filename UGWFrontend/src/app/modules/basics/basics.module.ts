import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingComponent } from './components/landing/landing.component';
import {BasicsRoutingModule} from './basics-routing.module';
import { HomeTableComponent } from './components/home-table/home-table.component';
import {UiModule} from '../ui/ui.module';
import {HttpClientModule} from '@angular/common/http';
import { StufeVertretungComponent } from './components/stufe-vertretung/stufe-vertretung.component';

@NgModule({
  declarations: [LandingComponent, HomeTableComponent, StufeVertretungComponent],
  imports: [
    CommonModule,
    BasicsRoutingModule,
    HttpClientModule,
    UiModule
  ]
})
export class BasicsModule { }
