import { TestBed } from '@angular/core/testing';

import { NotificationService } from './notification.service';
import {of} from 'rxjs';
import {environment} from '../../environments/environment';
import {SnackbarService} from './snackbar.service';
import {HttpClientModule} from '@angular/common/http';
import {AppService} from '../state/app.service';
import {AppQuery} from '../state/app.query';
import {AppStore} from '../state/app.store';

describe('NotificationService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientModule],
    providers: [NotificationService, SnackbarService, AppQuery, AppService, AppStore]
  }));

  it('should be created', () => {
    const service: NotificationService = TestBed.get(NotificationService);
    expect(service).toBeTruthy();
  });

  it('should subscribe to changes', () => {
    const mockObj = {
      subscription: of('someTest')
    };
    // @ts-ignore
    const service = new NotificationService(mockObj);
    expect(service).toBeTruthy();
    expect(service.subscription).toEqual('someTest');
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

  it('should tell if is Subscribed yet', () => {
    const service: NotificationService = TestBed.get(NotificationService);
    // @ts-ignore
    service.subscription = 'whatever';
    expect(service.isSubscribed()).toEqual(true);
    // @ts-ignore
    service.subscription = null;
    expect(service.isSubscribed()).toEqual(false);
  });


  it('should subscribeToPush', async () => {
    const service: NotificationService = TestBed.get(NotificationService);
    spyOn(service.http, 'post').and.returnValue(of('Ok'));
    // @ts-ignore
    service.appQuery = {
      loginToken: 'Test',
      credentialsToken: 'also a test'
    };

    const spy = spyOn(service, 'canPush').and.returnValue(false);
    expect(await service.subscribeToPush()).toEqual(false);
    spy.and.returnValue(true);
    // @ts-ignore
    // tslint:disable-next-line:max-line-length
    service.swPush = { requestSubscription: (opt) => {expect(opt.serverPublicKey).toEqual(environment.pushPublicKey); return Promise.resolve({toJSON: () => 'Ok'}); }};
    expect(await service.subscribeToPush()).toEqual(true);
    // @ts-ignore
    // tslint:disable-next-line:max-line-length
    service.swPush = { requestSubscription: (opt) => {expect(opt.serverPublicKey).toEqual(environment.pushPublicKey); return Promise.reject('test'); }};
    expect(await service.subscribeToPush()).toEqual(false);
  });


});
