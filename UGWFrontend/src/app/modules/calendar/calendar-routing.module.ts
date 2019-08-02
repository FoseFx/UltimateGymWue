import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RelatedMonthsComponent} from './related-months/related-months.component';

const routes: Routes = [
  {path: 'month', component: RelatedMonthsComponent},
  {path: '', pathMatch: 'full', redirectTo: 'month'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CalendarRoutingModule { }
