import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {NeedsSetupGuard} from './guards/needs-setup.guard';

const routes: Routes = [
  {
    path: 'setup',
    loadChildren: () => import('./modules/setup/setup.module').then(m => m.SetupModule),
  },
  {
    path: 'legal',
    redirectTo: 'setup/legal'
  },
  {
    path: 'basics',
    loadChildren: () => import('./modules/basics/basics.module').then(m => m.BasicsModule),
    canActivate: [NeedsSetupGuard]
  },
  {
    path: 'user',
    loadChildren: () => import('./modules/user/user.module').then(m => m.UserModule),
    canActivate: [NeedsSetupGuard]
  },
  {
    path: 'calendar',
    loadChildren: () => import('./modules/calendar/calendar.module').then(m => m.CalendarModule),
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
