import {TestBed} from '@angular/core/testing';

import {HasNetworkService} from './has-network.service';

describe('HasNetworkService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HasNetworkService = TestBed.get(HasNetworkService);
    expect(service).toBeTruthy();
  });
  describe('isOnline', () => {
    it('should return false', () => {
      const service: HasNetworkService = TestBed.get(HasNetworkService);
      service.isOnline$.next(false);
      console.log('online: ', service.isOnline$.getValue());
      expect(service.isOnline).toEqual(false);
    });
    it('should return true', () => {
      const service: HasNetworkService = TestBed.get(HasNetworkService);
      service.isOnline$.next(true);
      expect(service.isOnline).toEqual(true);
    });
  });
  describe('constructor', () => {
    it('should register listener for ononline', () => {
      const service: HasNetworkService = TestBed.get(HasNetworkService);
      const onlineEvent = new Event('online');
      service.isOnline$.next(false);
      expect(service.isOnline).toEqual(false);
      window.dispatchEvent(onlineEvent);
      expect(service.isOnline).toEqual(true);
    });
    it('should register listener for onoffline', () => {
      const service: HasNetworkService = TestBed.get(HasNetworkService);
      const offlineEvent = new Event('offline');
      service.isOnline$.next(true);
      expect(service.isOnline).toEqual(true);
      window.dispatchEvent(offlineEvent);
      expect(service.isOnline).toEqual(false);
    });
  });
});
