import { TestBed, async, inject } from '@angular/core/testing';

import { RegistersteptwoGuard } from './registersteptwo.guard';
import {SetupQuery} from '../state/setup.query';
import {RouterTestingModule} from '@angular/router/testing';
import {SetupStore} from '../state/setup.store';

describe('RegistersteptwoGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RegistersteptwoGuard, SetupQuery, SetupStore],
      imports: [RouterTestingModule]
    });
  });

  it('should ...', inject([RegistersteptwoGuard, SetupQuery], (guard: RegistersteptwoGuard, query: SetupQuery) => {
    expect(guard).toBeTruthy();
  }));

  it('not activate when no name set',
    inject(
      [RegistersteptwoGuard, SetupQuery],
      (guard: RegistersteptwoGuard, query: SetupQuery) => {
        spyOn(query, 'getValue').and.returnValue({name: null});
        expect(guard.canActivate(null, null)).toEqual(false);
      }
    )
  );
  it('activate when name set',
    inject(
      [RegistersteptwoGuard, SetupQuery],
      (guard: RegistersteptwoGuard, query: SetupQuery) => {
        spyOn(query, 'getValue').and.returnValue({name: 'Jeff'});
        expect(guard.canActivate(null, null)).toEqual(true);
      }
    )
  );
});
