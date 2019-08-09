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
import {UnhtmlPipe} from './components/stufe-vertretung/unhtml.pipe';
import {ExtractStyleTagsPipe} from './components/stufe-vertretung/extract-style-tags.pipe';
import {BasicsPopupComponent} from './components/basics-popup/basics-popup.component';
import {TimetableComponent} from './components/timetable/timetable.component';
import {HiddenNonKurseComponent} from './components/hidden-non-kurse/hidden-non-kurse.component';
import {NotificationComponent} from './components/notification/notification.component';

@NgModule({
  declarations: [
    LandingComponent,
    HomeTableComponent,
    StufeVertretungComponent,
    UnhtmlPipe,
    ExtractStyleTagsPipe,
    BasicsPopupComponent,
    TimetableComponent,
    HiddenNonKurseComponent,
    NotificationComponent
  ],
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
