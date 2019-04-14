import { TestBed } from '@angular/core/testing';
import {SetupService} from './setup.service';
import {SetupStore} from './setup.store';
import {SetupQuery} from './setup.query';


describe('SetupService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [SetupStore, SetupService, SetupQuery]
  }));

  it('should be created', () => {
    const service: SetupService = TestBed.get(SetupService);
    expect(service).toBeTruthy();
  });


  it('should set the name', () => {
    const service: SetupService = TestBed.get(SetupService);
    const query: SetupQuery = TestBed.get(SetupQuery);

    service.lockName('test');

    expect(query.getValue().name).toEqual('test');
  });



});

