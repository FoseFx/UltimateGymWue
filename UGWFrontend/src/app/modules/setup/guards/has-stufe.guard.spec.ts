import { TestBed, inject } from '@angular/core/testing';

import { HasStufeGuard } from './has-stufe.guard';
import {SetupStore} from '../state/setup.store';
import {SetupQuery} from '../state/setup.query';
import {RouterTestingModule} from '@angular/router/testing';
import {Router} from '@angular/router';

describe('HasStufeGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [HasStufeGuard, SetupStore, SetupQuery]
    });
  });

  it('should create', inject([HasStufeGuard], (guard: HasStufeGuard) => {
    expect(guard).toBeTruthy();
  }));

  it('should route to /setup/basics/stufe, when stufe not set in state', inject([HasStufeGuard, SetupQuery, Router],
    (guard: HasStufeGuard, query: SetupQuery, router: Router) => {
      spyOn(query, 'getStufe').and.returnValue(null);
      const result = guard.canActivate(null, null);
      expect(result).toEqual(router.parseUrl('/setup/basics/stufe'));
    }
  ));

  it('should allow, when stufe is set in state', inject([HasStufeGuard, SetupQuery],
    (guard: HasStufeGuard, query: SetupQuery) => {
      spyOn(query, 'getStufe').and.returnValue('SomeStufe');
      const result = guard.canActivate(null, null);
      expect(result).toEqual(true);
    }
  ));

});
