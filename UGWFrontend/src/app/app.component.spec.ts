import {async, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {AppComponent} from './app.component';
import {ToolbarComponent} from './components/toolbar/toolbar.component';
import {MenuComponent} from './components/menu/menu.component';
import {UiModule} from './modules/ui/ui.module';
import {AppStore} from './state/app.store';
import {AppQuery} from './state/app.query';
import {AppService} from './state/app.service';
import {SnackbarComponent} from './components/snackbar/snackbar.component';
import {SnackbarService} from './services/snackbar.service';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NotificationService} from './services/notification.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        UiModule,
        BrowserAnimationsModule,
        HttpClientTestingModule
  ],
      declarations: [
        AppComponent,
        ToolbarComponent,
        MenuComponent,
        SnackbarComponent
      ],
      providers: [
        AppStore,
        AppQuery,
        AppService,
        SnackbarService,
        NotificationService
      ]
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });
/*
  it(`should have as title 'UGWFrontend'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('UGWFrontend');
  });

  it('should render title in a h1 tag', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Welcome to UGWFrontend!');
  });
  */
});
