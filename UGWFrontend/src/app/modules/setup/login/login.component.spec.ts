import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {LoginComponent} from './login.component';
import {UiModule} from '../../ui/ui.module';
import {InputComponent} from '../../ui/input/input.component';
import {LoginService} from './login.service';
import {HttpClientModule} from '@angular/common/http';
import {AppService} from '../../../state/app.service';
import {AppStore} from '../../../state/app.store';
import {AppQuery} from '../../../state/app.query';
import {RouterTestingModule} from '@angular/router/testing';
import {fromEvent, of} from 'rxjs';
import {TrackingService} from '../../../services/tracking.service';
import {SnackbarService} from '../../../services/snackbar.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      imports: [UiModule, HttpClientModule, RouterTestingModule],
      providers: [LoginService, AppService, AppQuery, AppStore, SnackbarService, TrackingService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Input Validation', () => {
    let email: InputComponent;
    let password: InputComponent;
    describe('should not allow empty email field', () => {

      beforeEach(() => {
        email = new InputComponent(); // untouched
        password = new InputComponent();
      });
      it('password is empty', () => {
        // password untouched
        expect(component.allow(email, password)).toEqual(false);
      });
      it('password is invalid', () => {
        password.value = '123456';
        password.invalid = true;
        expect(component.allow(email, password)).toEqual(false);
      });
      it('password is valid', () => {
        password.value = '1234567890';
        password.invalid = false;
        expect(component.allow(email, password)).toEqual(false);
      });
    });
    describe('should not allow invalid email field', () => {

      beforeEach(() => {
        email = new InputComponent();
        email.invalid = true;
        email.value = 'n0tanemail';
        password = new InputComponent();
      });

      it('password is empty', () => {
        expect(component.allow(email, password)).toEqual(false);
      });
      it('password is invalid', () => {
        password.value = '12345';
        password.invalid = true;
        expect(component.allow(email, password)).toEqual(false);
      });
      it('password is valid', () => {
        password.value = '123456789';
        password.invalid = false;
        expect(component.allow(email, password)).toEqual(false);
      });
    });

    describe('should not allow password field', () => {

      beforeEach(() => {
        password = new InputComponent(); // untouched
        email = new InputComponent();
      });
      it('email is empty', () => {
        // email untouched
        expect(component.allow(email, password)).toEqual(false);
      });
      it('email is invalid', () => {
        email.value = '123456';
        email.invalid = true;
        expect(component.allow(email, password)).toEqual(false);
      });
      it('email is valid', () => {
        email.value = 'test@test.com';
        email.invalid = false;
        expect(component.allow(email, password)).toEqual(false);
      });
    });
    describe('should not allow invalid password field', () => {

      beforeEach(() => {
        password = new InputComponent();
        password.invalid = true;
        password.value = 'n0tanemail';
        email = new InputComponent();
      });

      it('email is empty', () => {
        expect(component.allow(email, password)).toEqual(false);
      });
      it('email is invalid', () => {
        email.value = '12345';
        email.invalid = true;
        expect(component.allow(email, password)).toEqual(false);
      });
      it('email is valid', () => {
        email.value = 'test@test.com';
        email.invalid = false;
        expect(component.allow(email, password)).toEqual(false);
      });
    });

    it('should be allow, when both valid', () => {
      email.invalid = false;
      email.value = 'test@test.com';
      password.invalid = false;
      password.value = '1234567890';
      expect(component.allow(email, password)).toEqual(true);
    });

  });

  it('should route', () => {
    const url = '';
    const spy = spyOn(component.router, 'navigate').and.callFake((val) => {
      expect(val).toEqual([url]);
    });
    component.route([url]);
    expect(spy).toHaveBeenCalled();
  });

  it('should unsubscribe', () => {
    component.subs = [fromEvent(window, 'onkeydown').subscribe()];
    expect(component.subs[0].closed).toEqual(false);
    component.ngOnDestroy();
    expect(component.subs[0].closed).toEqual(true);
  });

  describe('onsubmit', () => {
    it('should return without changes when not allowed', () => {
      const giveSpy = spyOn(component.trackingService, 'giveConsent');
      const revokeSpy = spyOn(component.trackingService, 'revokeConsent');
      component.subs = [];
      component.loading = false;
      // @ts-ignore
      component.onSubmit({invalid: true, value: ''}, {invalid: true, value: ''});
      expect(component.loading).toEqual(false);
      expect(component.subs).toEqual([]);
    });
    it('should set load to true and add normalLogin subscription', () => {
      const giveSpy = spyOn(component.trackingService, 'giveConsent');
      const revokeSpy = spyOn(component.trackingService, 'revokeConsent');
      component.subs = [];
      component.loading = false;
      spyOn(component, 'route').and.callFake(() => {});
      const spy = spyOn(component.loginService, 'normalLogin').and.returnValue(of({error: false, msg: 'ok'}));
      // @ts-ignore
      component.onSubmit({invalid: false, value: 'odkasokda'}, {invalid: false, value: 'sdak'});

      expect(component.loading).toEqual(true);
      expect(component.subs.length).toEqual(1);
      expect(spy).toHaveBeenCalled();
    });
    it('should give consent', () => {
      const giveSpy = spyOn(component.trackingService, 'giveConsent');
      const revokeSpy = spyOn(component.trackingService, 'revokeConsent');
      component.allowTracking = true;
      const o1 = {invalid: false, value: 'odkasokda'};
      const o2 = {invalid: false, value: 'sdak'};
      // @ts-ignore
      component.onSubmit(o1, o2);
      expect(giveSpy).toHaveBeenCalled();
      expect(revokeSpy).not.toHaveBeenCalled();
    });
    it('should revoke consent', () => {
      const giveSpy = spyOn(component.trackingService, 'giveConsent');
      const revokeSpy = spyOn(component.trackingService, 'revokeConsent');
      component.allowTracking = false;
      const o1 = {invalid: false, value: 'odkasokda'};
      const o2 = {invalid: false, value: 'sdak'};
      // @ts-ignore
      component.onSubmit(o1, o2);
      expect(giveSpy).not.toHaveBeenCalled();
      expect(revokeSpy).toHaveBeenCalled();
    });
  });

});
