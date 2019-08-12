import {TestBed} from '@angular/core/testing';

import {BasicsService} from './basics.service';
import {BasicsStore} from './basics.store';

describe('BasicsService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [BasicsStore, BasicsService]
  }));

  it('should be created', () => {
    const service: BasicsService = TestBed.get(BasicsService);
    expect(service).toBeTruthy();
  });

  it('should create new Popup', () => {
    const service: BasicsService = TestBed.get(BasicsService);
    const payload = {};
    const spy = spyOn(service.store, 'update').and.callFake(pl => {
      expect(pl).toEqual({showPopup: true, popupData: payload});
    });
    // @ts-ignore
    service.newPopup(payload);
    expect(spy).toHaveBeenCalled();
  });
  it('should close new Popup', () => {
    const service: BasicsService = TestBed.get(BasicsService);
    const spy = spyOn(service.store, 'update').and.callFake(pl => {
      expect(pl).toEqual({showPopup: false, popupData: null});
    });
    service.closePopup();
    expect(spy).toHaveBeenCalled();
  });
});
