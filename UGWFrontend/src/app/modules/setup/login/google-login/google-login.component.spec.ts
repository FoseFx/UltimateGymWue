import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {GoogleLoginComponent} from './google-login.component';
import {UiModule} from '../../../ui/ui.module';
import {GoogleSigninComponent} from '../../register/google/google.component';
import {RouterTestingModule} from '@angular/router/testing';
import {LoginService} from '../login.service';
import {AppService} from '../../../../state/app.service';
import {AppStore} from '../../../../state/app.store';
import {AppQuery} from '../../../../state/app.query';
import {HttpClientModule} from '@angular/common/http';
import {of} from "rxjs";
import {map} from "rxjs/operators";

describe('GoogleLoginComponent', () => {
  let component: GoogleLoginComponent;
  let fixture: ComponentFixture<GoogleLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [UiModule, RouterTestingModule, HttpClientModule],
      declarations: [ GoogleLoginComponent, GoogleSigninComponent ],
      providers: [LoginService, AppService, AppStore, AppQuery]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoogleLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle Ok', () => {
    component.loading = false;
    const spy = spyOn(component.loginService, 'googleLogin').and.returnValue(of({}));
    const spy2 = spyOn(component.router, 'navigate');
    // @ts-ignore
    component.onOk({getAuthResponse: () => ({id_token: 't'})});
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
    spy.and.returnValue(of({}).pipe(map(_ => {throw new Error('unlucky'); })))
    // @ts-ignore
    component.onOk({getAuthResponse: () => ({id_token: 't'})});

  });
});
