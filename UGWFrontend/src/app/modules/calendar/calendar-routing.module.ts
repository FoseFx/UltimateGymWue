import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RelatedMonthsComponent} from './related-months/related-months.component';
import {NewEventComponent} from './new-event/new-event.component';

const routes: Routes = [
  {path: 'month', component: RelatedMonthsComponent},
  {path: 'new', component: NewEventComponent},
  {path: '', pathMatch: 'full', redirectTo: 'month'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CalendarRoutingModule { }
