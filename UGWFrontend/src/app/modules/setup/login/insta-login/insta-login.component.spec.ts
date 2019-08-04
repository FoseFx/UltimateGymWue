import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {InstaLoginComponent} from './insta-login.component';
import {UiModule} from '../../../ui/ui.module';
import {AppService} from '../../../../state/app.service';
import {AppStore} from '../../../../state/app.store';
import {LoginService} from '../login.service';
import {HttpClientModule} from '@angular/common/http';
import {AppQuery} from '../../../../state/app.query';
import {RouterTestingModule} from '@angular/router/testing';
import {InstaComponent} from "../../register/insta/insta.component";
import {of} from "rxjs";

describe('InstaLoginComponent', () => {
  let component: InstaLoginComponent;
  let fixture: ComponentFixture<InstaLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [UiModule, HttpClientModule, RouterTestingModule],
      declarations: [ InstaLoginComponent ],
      providers: [AppQuery, AppService, AppStore, LoginService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstaLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle onClick', () => {
    component.error = 'sth';
    spyOn(InstaComponent, 'createPopup').and.returnValue(null);
    const spy2 = spyOn(InstaComponent, 'startInterval');
    component.onClick();
    expect(component.error).toBe(undefined);
    expect(spy2).not.toHaveBeenCalled();
  });
  it('should handle onClick with popup', () => {
    spyOn(InstaComponent, 'createPopup').and.returnValue({});
    const spy2 = spyOn(InstaComponent, 'startInterval');
    component.onClick();
    expect(spy2).toHaveBeenCalled();
  });
  it('should handle onData', () => {
    spyOn(InstaComponent, 'preRequest').and.returnValue(null);
    const spy = spyOn(component.loginService, 'instaLogin');
    component.onData('nvm');
    expect(spy).not.toHaveBeenCalled();
  });
  it('should make request', () => {
    spyOn(InstaComponent, 'preRequest').and.returnValue({code: 'code', firstPart: 'fp'});
    const spy = spyOn(component.loginService, 'instaLogin').and.returnValue(of({}));
    const spy2 = spyOn(component.router, 'navigate');
    component.onData('nvm');
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });
});
