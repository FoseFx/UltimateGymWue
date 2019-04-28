import { TestBed, async, inject } from '@angular/core/testing';

import { RegistersteptwoGuard } from './registersteptwo.guard';
import {SetupQuery} from '../state/setup.query';
import {RouterTestingModule} from '@angular/router/testing';
import {SetupStore} from '../state/setup.store';
import { RegisterComponent } from '../register/register.component';
import { UiModule } from '../../ui/ui.module';
import {Router} from '@angular/router';

describe('RegistersteptwoGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RegistersteptwoGuard, SetupQuery, SetupStore],
      imports: [RouterTestingModule.withRoutes([
        { path: 'setup/register', component: RegisterComponent}
    ]), UiModule],
    declarations: [RegisterComponent]
    });
  });

  it('should ...', inject([RegistersteptwoGuard, SetupQuery], (guard: RegistersteptwoGuard, query: SetupQuery) => {
    expect(guard).toBeTruthy();
  }));

  it('route to \'/setup/register\' when no name set',
    inject(
      [RegistersteptwoGuard, SetupQuery, Router],
      (guard: RegistersteptwoGuard, query: SetupQuery, router: Router) => {
        spyOn(query, 'getValue').and.returnValue({name: null});
        expect(guard.canActivate(null, null)).toEqual(router.parseUrl('/setup/register'));
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
