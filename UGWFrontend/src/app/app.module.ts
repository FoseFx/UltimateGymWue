import {BrowserModule} from '@angular/platform-browser';
import {LOCALE_ID, NgModule} from '@angular/core';
import {registerLocaleData} from '@angular/common';
import localeDe from '@angular/common/locales/de';
import localeDeExtra from '@angular/common/locales/extra/de';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {AppStore} from './state/app.store';
import {AkitaNgDevtools} from '@datorama/akita-ngdevtools';
import {environment} from '../environments/environment';
import {ToolbarComponent} from './components/toolbar/toolbar.component';
import {MenuComponent} from './components/menu/menu.component';
import {AppQuery} from './state/app.query';
import {AppService} from './state/app.service';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {UiModule} from './modules/ui/ui.module';
import {NeedsSetupGuard} from './guards/needs-setup.guard';
import {ServiceWorkerModule} from '@angular/service-worker';
import {KeyService} from './services/key.service';
import {SnackbarComponent} from './components/snackbar/snackbar.component';
import {SnackbarService} from './services/snackbar.service';
import {TrackingService} from './services/tracking.service';
import {NotificationService} from './services/notification.service';

registerLocaleData(localeDe, 'de-DE', localeDeExtra);

@NgModule({
  declarations: [
    AppComponent,
    ToolbarComponent,
    MenuComponent,
    SnackbarComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    UiModule,
    environment.production ? [] : AkitaNgDevtools.forRoot(),
    ServiceWorkerModule.register('ngsw-worker.js', {enabled: environment.production})
  ],
  providers: [
    {provide: LOCALE_ID,  useValue: 'de-DE'},
    AppStore,
    AppQuery,
    AppService,
    NeedsSetupGuard,
    KeyService,
    SnackbarService,
    TrackingService,
    NotificationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
