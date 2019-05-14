import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingComponent } from './components/landing/landing.component';
import {BasicsRoutingModule} from './basics-routing.module';
import { HomeTableComponent } from './components/home-table/home-table.component';
import {UiModule} from '../ui/ui.module';

@NgModule({
  declarations: [LandingComponent, HomeTableComponent],
  imports: [
    CommonModule,
    BasicsRoutingModule,
    UiModule
  ]
})
export class BasicsModule { }
