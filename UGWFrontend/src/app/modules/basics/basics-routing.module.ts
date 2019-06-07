import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LandingComponent} from './components/landing/landing.component';
import {TimetableComponent} from './components/timetable/timetable.component';

const routes: Routes = [
  {
    path: 'landing',
    component: LandingComponent
  },
  {
    path: 'stundenplan',
    component: TimetableComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BasicsRoutingModule { }
