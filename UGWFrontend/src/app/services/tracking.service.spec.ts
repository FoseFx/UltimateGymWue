import {TestBed} from '@angular/core/testing';

import {TrackingService} from './tracking.service';
import {SnackbarService} from './snackbar.service';

describe('TrackingService', () => {
  beforeEach(() => TestBed.configureTestingModule({providers: [SnackbarService, TrackingService]}));

  it('should be created', () => {
    const service: TrackingService = TestBed.get(TrackingService);
    expect(service).toBeTruthy();
  });

  it('should giveConsent', () => {
    window._paq = [];
    const service: TrackingService = TestBed.get(TrackingService);
    service.giveConsent();
    expect(window._paq).toEqual([['rememberConsentGiven']]);
  });
  it('should revokeConsent', () => {
    window._paq = [];
    const service: TrackingService = TestBed.get(TrackingService);
    let called = false;
    service.snackbarService.addSnackbar = (msg, ttl, type) => {
      called = true;
      expect(msg).toEqual('Das Sammeln von Verhaltensdaten wurde gestoppt.');
      expect(ttl).toEqual(2000);
      expect(type).toEqual('warning');
    };
    service.revokeConsent();
    expect(window._paq).toEqual([['forgetConsentGiven']]);
    expect(called).toEqual(true);
  });
});
