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
import {environment} from "../../../../../environments/environment";

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
    const sIf = window.setInterval;
    // @ts-ignore
    window.setInterval = (fn: () => any, to: number) => {
      expect(to).toBe(500);
      window.setInterval = sIf;
      next();
    };
    // @ts-ignore
    component.startInterval({closed: true});
  });

});
