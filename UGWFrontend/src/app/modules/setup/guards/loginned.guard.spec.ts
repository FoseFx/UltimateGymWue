import {inject, TestBed} from '@angular/core/testing';
import {LoginnedGuard} from './loginned.guard';
import {AppQuery} from '../../../state/app.query';
import {AppStore} from '../../../state/app.store';
import {RouterTestingModule} from '@angular/router/testing';
import {Router} from '@angular/router';

describe('LoginnedGuard', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [LoginnedGuard, AppQuery, AppStore]
    });
  });

  it('should create', inject([LoginnedGuard], (guard: LoginnedGuard) => {
    expect(guard).toBeTruthy();
  }));

  it('should route to \'/setup/welcome\' when no login data in store',
    inject([LoginnedGuard, AppQuery, Router], (guard: LoginnedGuard, query: AppQuery, router: Router) => {
      spyOn(query, 'getValue').and.returnValue({loginData: null});
      expect(guard.canActivate(null, null)).toEqual(router.parseUrl('/setup/welcome'));
    })
  );

  it('should allow when login data is in store',
    inject([LoginnedGuard, AppQuery], (guard: LoginnedGuard, query: AppQuery) => {
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
      expect(guard.canActivate(null, null)).toEqual(true);
    })
  );

});
