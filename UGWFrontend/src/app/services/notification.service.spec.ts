import { TestBed } from '@angular/core/testing';

import { NotificationService } from './notification.service';
/*

CANNOT TEST BECAUSE OF SWPUSH
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


});
*/
