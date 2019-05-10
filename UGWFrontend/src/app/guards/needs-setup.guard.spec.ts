import { TestBed, inject } from "@angular/core/testing";
import { RouterTestingModule } from '@angular/router/testing';
import { AppStore } from '../state/app.store';
import { AppQuery } from '../state/app.query';
import { NeedsSetupGuard } from './needs-setup.guard';
import { Router } from '@angular/router';


describe('NeedsSetupGuard', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
          imports: [RouterTestingModule],
          providers: [NeedsSetupGuard, AppQuery, AppStore]
        });
      });

      it('should create', inject([NeedsSetupGuard], (guard: NeedsSetupGuard) => {
        expect(guard).toBeTruthy();
      }));

      
      it('should route to /setup/welcome, when not loginned (1/2)', inject([NeedsSetupGuard, AppQuery, Router], 
        (guard: NeedsSetupGuard, query: AppQuery, router: Router) => {
            spyOn(query, 'getValue').and.returnValue({loginData: null, basics: null});
            const result = guard.canActivate(null, null);
            expect(result).toEqual(router.createUrlTree(['/setup/welcome']));
      }));
      it('should route to /setup/welcome, when not loginned (2/2)', inject([NeedsSetupGuard, AppQuery, Router], 
        (guard: NeedsSetupGuard, query: AppQuery, router: Router) => {
            spyOn(query, 'getValue').and.returnValue({loginData: null, basics: true});
            const result = guard.canActivate(null, null);
            expect(result).toEqual(router.createUrlTree(['/setup/welcome']));
      }));

      it('should route to /setup/basics, when no basics set', inject([NeedsSetupGuard, AppQuery, Router], 
        (guard: NeedsSetupGuard, query: AppQuery, router: Router) => {
            spyOn(query, 'getValue').and.returnValue({loginData: true, basics: null});
            const result = guard.canActivate(null, null);
            expect(result).toEqual(router.createUrlTree(['/setup/basics']));
      }));

      it('should allow, when logged in and basics set', inject([NeedsSetupGuard, AppQuery, Router], 
        (guard: NeedsSetupGuard, query: AppQuery, router: Router) => {
            spyOn(query, 'getValue').and.returnValue({loginData: true, basics: true});
            const result = guard.canActivate(null, null);
            expect(result).toEqual(true);
      }));

});