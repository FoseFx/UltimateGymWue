import {TestBed} from '@angular/core/testing';
import {BasicsQuery} from './basics.query';
import {BasicsStore} from './basics.store';

describe('BasicsQuery', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [BasicsStore, BasicsQuery]
  }));

  /*it('should be created', () => {
    const service: BasicsQuery = TestBed.get(BasicsQuery);
    expect(service).toBeTruthy();
  });*/
});
