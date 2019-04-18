import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {AppStore} from './state/app.store';
import { AkitaNgDevtools } from '@datorama/akita-ngdevtools';
import { environment } from '../environments/environment';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { MenuComponent } from './components/menu/menu.component';
import {AppQuery} from './state/app.query';
import {AppService} from './state/app.service';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { UiModule} from './modules/ui/ui.module';
import {LoginGuard} from './guards/login.guard';

@NgModule({
  declarations: [
    AppComponent,
    ToolbarComponent,
    MenuComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    UiModule,
    environment.production ? [] : AkitaNgDevtools.forRoot()
  ],
  providers: [
    AppStore,
    AppQuery,
    AppService,
    LoginGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
