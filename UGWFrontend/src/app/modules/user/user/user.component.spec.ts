import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {UserComponent} from './user.component';
import {UiModule} from '../../ui/ui.module';
import {AppQuery} from '../../../state/app.query';
import {AppStore} from '../../../state/app.store';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientModule} from '@angular/common/http';
import {of} from 'rxjs';
import {environment} from '../../../../environments/environment';

describe('UserComponent', () => {
  let component: UserComponent;
  let fixture: ComponentFixture<UserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [UiModule, RouterTestingModule, HttpClientModule],
      declarations: [ UserComponent ],
      providers: [AppStore, AppQuery]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should showAccountLoeschen', () => {
      component.showLogoutPopup = true;
      component.logoutOrAccountRemoval = 0;
      component.showAccountLoeschen();
      expect(component.showLogoutPopup).toEqual(true);
      expect(component.logoutOrAccountRemoval).toEqual(1);
    });

  it('should doShowLogout', () => {
      component.showLogoutPopup = false;
      component.logoutOrAccountRemoval = 1;
      component.doShowLogout();
      expect(component.showLogoutPopup).toEqual(true);
      expect(component.logoutOrAccountRemoval).toEqual(0);
    });

  it('should removeAcc', () => {
      const l = spyOn(component, 'logout').and.callFake(() => {});
      spyOn(component.appQuery, 'getValue').and.returnValue({loginData: {token: 'test'}});
      spyOn(component.http, 'delete').and.callFake((v, c) => {
        expect(v).toEqual(environment.urls.removeAccount);
        expect(c.headers.authorization).toEqual('Bearer test');
        return of({error: false, msg: 'Ok'});
      });
      component.removeAcc();
      expect(l).toHaveBeenCalled();
    });
});
