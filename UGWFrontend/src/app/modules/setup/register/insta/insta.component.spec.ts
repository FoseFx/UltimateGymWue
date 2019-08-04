import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {InstaComponent} from './insta.component';
import {UiModule} from '../../../ui/ui.module';
import {HttpClientModule} from '@angular/common/http';
import {SetupQuery} from '../../state/setup.query';
import {SetupStore} from '../../state/setup.store';
import {AppService} from '../../../../state/app.service';
import {AppStore} from '../../../../state/app.store';
import {AppQuery} from '../../../../state/app.query';
import {RouterTestingModule} from '@angular/router/testing';
import {SetupService} from '../../state/setup.service';
import {environment} from '../../../../../environments/environment';
import {of} from 'rxjs';

describe('InstaComponent', () => {
  let component: InstaComponent;
  let fixture: ComponentFixture<InstaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [UiModule, HttpClientModule, RouterTestingModule],
      declarations: [ InstaComponent ],
      providers: [SetupQuery, SetupStore, AppService, AppStore, AppQuery, SetupService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create new window', () => {
    // @ts-ignore
    const fakeScreen: Screen = {width: 1920, height: 1080};
    const spy = spyOn(window, 'open').and.callFake((url, target, feat) => {
      expect(url).toBe(environment.urls.registerInstaRediect);
      expect(target).toBe('popup');
      expect(feat).toBe('top=240,left=660,width=600,height=600');
    });
    component.createPopup(fakeScreen);
    expect(spy).toHaveBeenCalled();
  });

  it('should handle onClick', () => {
    const spy = spyOn(component, 'createPopup');
    const spy2 = spyOn(component, 'startInterval');
    component.error = 'test';
    component.onClick();
    expect(component.error).toBe(undefined);
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });
  it('should handle blocked popup', () => {
    const spy = spyOn(component, 'createPopup').and.returnValue(null);
    const spy2 = spyOn(component, 'startInterval');
    component.error = 'test';
    component.onClick();
    expect(component.error).toBe(undefined);
    expect(spy).toHaveBeenCalled();
    expect(spy2).not.toHaveBeenCalled();
  });

  it('should set the Interval', (next) => {
    // @ts-ignore
    spyOn(window, 'setInterval').and.callFake((fn: () => any, to: number) => {
      expect(to).toBe(500);
      const spy = spyOn(window, 'clearInterval');
      fn();
      expect(spy).toHaveBeenCalled();
      next();
    });
    // @ts-ignore
    component.startInterval({closed: true, location: {href: 'some-str'}});
  });

  it('should close window', (next) => {
    let called = false;
    // @ts-ignore
    spyOn(window, 'setInterval').and.callFake((fn: () => any, to: number) => {
      component.loading = false;
      expect(to).toBe(500);
      const spy = spyOn(window, 'clearInterval');
      const spy2 = spyOn(component, 'onData');
      fn();
      expect(spy).toHaveBeenCalled();
      expect(spy2).toHaveBeenCalled();
      expect(called).toBe(true);
      expect(component.loading).toBe(true);
      next();
    });
    // @ts-ignore
    component.startInterval({closed: true, location: {href: 'https://sub.domain.test.com/assets/insta-redirect.html'}, close: () => called = true});
  });

  describe('inData', () => {
    it('should show error', () => {
      spyOn(component, 'extractQueries').and.returnValue({error: true, error_description: 'some-str'});
      component.error = undefined;
      component.loading = true;
      component.onData('stubbed');
      expect(component.error).toBe('some-str');
      expect(component.loading).toBe(false);
    });

    it('should show error when invalid', () => {
      spyOn(component, 'extractQueries').and.returnValue({});
      component.error = undefined;
      component.loading = true;
      component.onData('stubbed');
      expect(component.error).toBe('Instagram hat nicht wie erwartet geantwortet.');
      expect(component.loading).toBe(false);
    });

    it('should request', () => {
      spyOn(component, 'extractQueries').and.returnValue({code: 'some-code'});
      spyOn(component.query, 'getValue').and.returnValue({name: 'some-name'});
      spyOn(component.setupService, 'justRegistered');
      spyOn(component.service, 'onLogin');
      spyOn(component.router, 'navigate');
      const httpSpy = spyOn(component.http, 'post').and.callFake((_, body) => {
        expect(body.code).toBe('some-code');
        expect(body.href).toBe('https://some-domain.domain.com/test');
        expect(body.fullname).toBe('some-name');
        return of({});
      });
      component.onData('https://some-domain.domain.com/test?q=test');
      expect(httpSpy).toHaveBeenCalled();
    });

  });

  it('should extractQueries', () => {
    const href = 'https://some-str.com/assets/insta-redirect.html?error=true&error_description=some%20message&error_reason=reason&code=code';
    const obj = component.extractQueries(href);
    expect(obj.code).toBe('code');
    expect(obj.error).toBe('true');
    expect(obj.error_description).toBe('some%20message');
    expect(obj.error_reason).toBe('reason');
  });

});
