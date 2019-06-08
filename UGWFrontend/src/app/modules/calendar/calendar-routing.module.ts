import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MonthComponent} from './month/month.component';

const routes: Routes = [
  {path: 'month', component: MonthComponent},
  {path: '', pathMatch: 'full', redirectTo: 'month'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CalendarRoutingModule { }
