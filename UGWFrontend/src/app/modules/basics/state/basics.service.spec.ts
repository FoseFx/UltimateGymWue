import {TestBed} from '@angular/core/testing';

import {BasicsService} from './basics.service';
import {BasicsStore} from './basics.store';

describe('BasicsService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [BasicsStore, BasicsService]
  }));

  /*it('should be created', () => {
    const service: BasicsService = TestBed.get(BasicsService);
    expect(service).toBeTruthy();
  });*/
});
