import { TestBed, inject } from '@angular/core/testing';
import {LoginGuard} from './login.guard';
import {AppQuery} from '../../../state/app.query';
import {AppStore} from '../../../state/app.store';
import {RouterTestingModule} from '@angular/router/testing';
import {Router} from '@angular/router';

describe('LoginGuard', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [LoginGuard, AppQuery, AppStore]
    });
  });

  it('should create', inject([LoginGuard], (guard: LoginGuard) => {
    expect(guard).toBeTruthy();
  }));

  it('should allow when no login data in store',
    inject([LoginGuard, AppQuery], (guard: LoginGuard, query: AppQuery) => {
      spyOn(query, 'getValue').and.returnValue({loginData: null});
      expect(guard.canActivate(null, null)).toEqual(true);
    })
  );

  it('should route to \'/\' when login data is in store',
    inject([LoginGuard, AppQuery, Router], (guard: LoginGuard, query: AppQuery, router: Router) => {
      spyOn(query, 'getValue').and.returnValue(
        {
          loginData: {
            token: 'token',
            uid: 'uid',
            provider: ['normal'],
            normal: {
              email: 'test@test.com',
              email_verified: false
            },
            google: null,
            insta: null
          }
        });
      expect(guard.canActivate(null, null)).toEqual(router.parseUrl('/'));
    })
  );

});
