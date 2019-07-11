import { TestBed } from '@angular/core/testing';

import {defaultActions, SnackbarService} from './snackbar.service';

describe('SnackbarService', () => {
  beforeEach(() => TestBed.configureTestingModule({providers: [SnackbarService]}));

  it('should be created', () => {
    const service: SnackbarService = TestBed.get(SnackbarService);
    expect(service).toBeTruthy();
  });

  it('should behave like this default', () => {
    spyOn(window, 'clearTimeout').and.callFake((val) => {
      expect(val).toEqual(999);
    });
    let called = false;
    // @ts-ignore
    defaultActions['Schließen']({setTimeout: 999, close: () => called = true});
    expect(called).toEqual(true);
  });
});
