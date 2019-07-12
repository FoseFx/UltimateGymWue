import { TestBed } from '@angular/core/testing';

import { TrackingService } from './tracking.service';
import {SnackbarService} from './snackbar.service';

describe('TrackingService', () => {
  beforeEach(() => TestBed.configureTestingModule({providers: [SnackbarService, TrackingService]}));

  it('should be created', () => {
    const service: TrackingService = TestBed.get(TrackingService);
    expect(service).toBeTruthy();
  });
});
