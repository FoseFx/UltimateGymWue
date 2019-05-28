import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LandingComponent} from './components/landing/landing.component';
import {BasicsRoutingModule} from './basics-routing.module';
import {HomeTableComponent} from './components/home-table/home-table.component';
import {UiModule} from '../ui/ui.module';
import {HttpClientModule} from '@angular/common/http';
import {StufeVertretungComponent} from './components/stufe-vertretung/stufe-vertretung.component';
import {BasicsQuery} from './state/basics.query';
import {BasicsStore} from './state/basics.store';
import {BasicsService} from './state/basics.service';

@NgModule({
  declarations: [LandingComponent, HomeTableComponent, StufeVertretungComponent],
  providers: [
    BasicsStore,
    BasicsQuery,
    BasicsService
  ],
  imports: [
    CommonModule,
    BasicsRoutingModule,
    HttpClientModule,
    UiModule
  ]
})
export class BasicsModule { }
