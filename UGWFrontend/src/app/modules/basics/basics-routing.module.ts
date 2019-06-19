import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LandingComponent} from './components/landing/landing.component';
import {TimetableComponent} from './components/timetable/timetable.component';
import {HiddenNonKurseComponent} from './components/hidden-non-kurse/hidden-non-kurse.component';

const routes: Routes = [
  {
    path: 'landing',
    component: LandingComponent
  },
  {
    path: 'stundenplan',
    component: TimetableComponent
  },
  {
    path: 'hide',
    component: HiddenNonKurseComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BasicsRoutingModule { }
