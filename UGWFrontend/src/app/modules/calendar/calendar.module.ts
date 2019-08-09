import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {CalendarRoutingModule} from './calendar-routing.module';
import {MonthComponent} from './month/month.component';
import {HttpClientModule} from '@angular/common/http';
import {ShowEventComponent} from './show-event/show-event.component';
import {UiModule} from "../ui/ui.module";
import {RelatedMonthsComponent} from './related-months/related-months.component';

@NgModule({
  declarations: [MonthComponent, ShowEventComponent, RelatedMonthsComponent],
  imports: [
    CommonModule,
    CalendarRoutingModule,
    HttpClientModule,
    UiModule
  ]
})
export class CalendarModule { }
