import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {NormalComponent} from './normal.component';
import {UiModule} from '../../../ui/ui.module';
import {SetupQuery} from '../../state/setup.query';
import {SetupStore} from '../../state/setup.store';
import {HttpClientModule} from '@angular/common/http';
import {SetupService} from '../../state/setup.service';
import {LoginService} from '../../login/login.service';
import {AppStore} from '../../../../state/app.store';
import {AppQuery} from '../../../../state/app.query';
import {AppService} from '../../../../state/app.service';
import {RouterTestingModule} from '@angular/router/testing';
import {of} from "rxjs";
import {map} from "rxjs/operators";

describe('NormalComponent', () => {
  let component: NormalComponent;
  let fixture: ComponentFixture<NormalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NormalComponent ],
      imports: [UiModule, HttpClientModule, RouterTestingModule],
      providers: [SetupQuery, SetupStore, SetupService, LoginService, AppService, AppStore, AppQuery]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NormalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call invalid', () => {
    const email = {value: 'test', invalid: false};
    const passw = {value: 'hi', invalid: false};
    // @ts-ignore
    const res1 = component.invalid(email, passw, passw);
    expect(res1).toEqual(false);
    email.invalid = true;
    // @ts-ignore
    expect(component.invalid(email, passw, passw)).toEqual(true);
  });

  it('should call onSuccess', () => {
    const spy = spyOn(component.loginService, 'normalLogin').and.returnValue(of({}).pipe(map(_ => {
      throw new Error('unlucky');
    })));
    const spy2 = spyOn(component.service, 'justRegistered');
    const spy3 = spyOn(component.router, 'navigate');
    const email = {value: 'email'};
    const passw = {value: 'passw'};
    const sub = {unsubscribe: () => {}};
    // @ts-ignore
    component.onSuccess('some str', sub, email, passw);
    expect(spy).toHaveBeenCalled();
    expect(spy2).not.toHaveBeenCalled();

    spy.and.returnValue(of({}));
    // @ts-ignore
    component.onSuccess('some str', sub, email, passw);
    expect(spy2).toHaveBeenCalled();
    expect(spy3).toHaveBeenCalled();
  });

  it('should handle click', () => {
    component.loading = false;
    const spy = spyOn(component, 'invalid').and.returnValue(true);
    const spy2 = spyOn(component.http, 'post').and.returnValue(of('str'));
    const spy3 = spyOn(component, 'onSuccess');
    component.onClick(undefined, undefined, undefined);
    expect(spy).toHaveBeenCalled();
    expect(component.loading).toEqual(false);
    spy.and.returnValue(false);
    spy.calls.reset();
    const someObj = {value: 'idk'};
    // @ts-ignore
    component.onClick(someObj, someObj, someObj);
    expect(spy).toHaveBeenCalled();
    expect(component.loading).toEqual(true);
    expect(spy2).toHaveBeenCalled();
    // expect(spy3).toHaveBeenCalled();
  });
});
