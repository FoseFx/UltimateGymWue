import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {NeedsSetupGuard} from './guards/needs-setup.guard';

const routes: Routes = [
  {
    path: 'setup',
    loadChildren: './modules/setup/setup.module#SetupModule',
  },
  {
    path: 'legal',
    redirectTo: 'setup/legal'
  },
  {
    path: 'basics',
    loadChildren: './modules/basics/basics.module#BasicsModule',
    canActivate: [NeedsSetupGuard]
  },
  {
    path: '',
    redirectTo: 'basics/landing',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
