import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {GoogleComponent, GoogleSigninComponent, GoogleUser} from './google.component';
import {UiModule} from '../../../ui/ui.module';
import {HttpClientModule} from '@angular/common/http';
import {RouterTestingModule} from '@angular/router/testing';
import {SetupQuery} from '../../state/setup.query';
import {SetupStore} from '../../state/setup.store';
import {LoginService} from '../../login/login.service';
import {AppStore} from '../../../../state/app.store';
import {AppService} from '../../../../state/app.service';
import {AppQuery} from '../../../../state/app.query';
import {SetupService} from '../../state/setup.service';
import {of} from 'rxjs';
import {map} from 'rxjs/operators';

describe('GoogleComponent', () => {
  let component: GoogleComponent;
  let fixture: ComponentFixture<GoogleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [UiModule, HttpClientModule, RouterTestingModule],
      declarations: [ GoogleComponent, GoogleSigninComponent ],
      providers: [SetupQuery, SetupStore, LoginService, AppStore, AppService, AppQuery, SetupService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoogleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call onOk', () => {
    component.error = 'some message';
    component.loading = false;
    spyOn(component.query, 'getValue').and.returnValue({name: 'Hi c:'});
    const spy1 = spyOn(component.changedetectionRef, 'detectChanges');
    const spy2 = spyOn(component, 'handleSuccess');
    const spy3 = spyOn(component.http, 'post').and.returnValue(of({}));
    // @ts-ignore
    component.onOk({getAuthResponse: () => ({id_token: 'token'})});
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
    expect(spy3).toHaveBeenCalled();
    expect(component.error).toEqual(undefined);
    expect(component.loading).toEqual(true);

    spy3.and.returnValue(of({}).pipe(map(_ => {throw new Error('Hey!'); })));
    const spy4 = spyOn(component, 'handleError');
    // @ts-ignore
    component.onOk({getAuthResponse: () => ({id_token: 'token'})});
    expect(spy4).toHaveBeenCalled();

  });

  it('should call handleError', () => {
    component.loading = true;
    component.error = undefined;
    const spy = spyOn(component.changedetectionRef, 'detectChanges');
    // @ts-ignore
    component.handleError({
      error: {},
      message: 'fallback'
    });
    expect(spy).toHaveBeenCalled();
    expect(component.loading).toEqual(false);
    expect(component.error).toEqual('fallback');
    // @ts-ignore
    component.handleError({
      error: {msg: 'error message'},
      message: 'fallback'
    });
    expect(component.error).toEqual('error message');

    // @ts-ignore
    component.handleError({
      error: {msg: 'error message'},
      message: 'fallback'
    }, true);
    expect(component.error).toEqual('Nach erfolgreicher Registrierung: error message');

  });

  it('should handleSuccess', () => {
    spyOn(component.loginService, 'googleLogin').and.returnValue(of({}));
    const routerSpy = spyOn(component.router, 'navigate');

    component.handleSuccess({}, {token: 'token'});
    expect(routerSpy).toHaveBeenCalled();
  });
});


describe('GoogleSignInComponent', () => {
  let component: GoogleSigninComponent;
  let fixture: ComponentFixture<GoogleSigninComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [UiModule, HttpClientModule, RouterTestingModule],
      declarations: [ GoogleComponent, GoogleSigninComponent ],
      providers: [SetupQuery, SetupStore, LoginService, AppStore, AppService, AppQuery, SetupService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoogleSigninComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call onSuccess', () => {
    // @ts-ignore
    const argument: GoogleUser = 'some test';
    // @ts-ignore
    const that: GoogleSigninComponent = {ok: {emit: (arg) => {expect(arg).toEqual(argument); }}};
    component.onSuccess(argument, that);
    component.onSuccess(argument);
  });
});
