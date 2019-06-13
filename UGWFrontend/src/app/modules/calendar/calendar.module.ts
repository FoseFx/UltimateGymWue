import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {CalendarRoutingModule} from './calendar-routing.module';
import {MonthComponent} from './month/month.component';
import {HttpClientModule} from '@angular/common/http';

@NgModule({
  declarations: [MonthComponent],
  imports: [
    CommonModule,
    CalendarRoutingModule,
    HttpClientModule
  ]
})
export class CalendarModule { }
