import { TestBed } from '@angular/core/testing';

import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [NotificationService]
  }));

  it('should be created', () => {
    const service: NotificationService = TestBed.get(NotificationService);
    expect(service).toBeTruthy();
  });

  it('should tell if service worker is existent', () => {
    const service: NotificationService = TestBed.get(NotificationService);
    // @ts-ignore
    service.navRef = {serviceWorker: {}};
    expect(service.hasSW()).toEqual(true);
    // @ts-ignore
    service.navRef = {serviceWorker: undefined};
    expect(service.hasSW()).toEqual(false);
  });

  it('should tell if PM is existent', () => {
    const service: NotificationService = TestBed.get(NotificationService);
    // @ts-ignore
    service.windowRef = {PushManager: {}};
    expect(service.canPush()).toEqual(true);
    // @ts-ignore
    service.windowRef = {};
    expect(service.canPush()).toEqual(false);
  });

  it('should return serviceworker registration', (done) => {
    const service: NotificationService = TestBed.get(NotificationService);
    // @ts-ignore
    service.navRef = {serviceWorker: {getRegistration: () => Promise.resolve('test')}};
    service.getSWReg().then((v) => {
      // @ts-ignore
      expect(v).toEqual('test');
      done();
    });
  });

  it('should return null when no serviceworker registration', (done) => {
    const service: NotificationService = TestBed.get(NotificationService);
    // @ts-ignore
    spyOn(service, 'hasSW').and.returnValue(false);
    service.getSWReg().then((v) => {
      expect(v).toEqual(null);
      done();
    });
  });

  it('should return null as PM when no serviceworker registration', async () => {
    const service: NotificationService = TestBed.get(NotificationService);
    spyOn(service, 'getSWReg').and.returnValue(Promise.resolve(null));
    const pm = await service.getPushManager();
    expect(pm).toEqual(null);
  });

  it('should return PM', async () => {
    const service: NotificationService = TestBed.get(NotificationService);
    // @ts-ignore
    spyOn(service, 'getSWReg').and.returnValue(Promise.resolve({pushManager: 'test'}));
    const pm = await service.getPushManager();
    // @ts-ignore
    expect(pm).toEqual('test');
  });


});
