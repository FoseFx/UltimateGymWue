import { TestBed } from '@angular/core/testing';

import { HasNetworkService } from './has-network.service';

describe('HasNetworkService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HasNetworkService = TestBed.get(HasNetworkService);
    expect(service).toBeTruthy();
  });
});
