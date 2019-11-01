import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {CalendarRoutingModule} from './calendar-routing.module';
import {MonthComponent} from './month/month.component';
import {ShowEventComponent} from './show-event/show-event.component';
import {UiModule} from "../ui/ui.module";
import {RelatedMonthsComponent} from './related-months/related-months.component';
import { NewEventComponent } from './new-event/new-event.component';

@NgModule({
  declarations: [MonthComponent, ShowEventComponent, RelatedMonthsComponent, NewEventComponent],
  imports: [
    CommonModule,
    CalendarRoutingModule,
    UiModule
  ]
})
export class CalendarModule { }
