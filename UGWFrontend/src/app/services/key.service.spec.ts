import {TestBed} from '@angular/core/testing';

import {eventKeyMap, KeyService} from './key.service';
import {of} from 'rxjs';

describe('KeyService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: KeyService = TestBed.get(KeyService);
    expect(service).toBeTruthy();
  });

  describe('eventKeyMap', () => {
    it('should handle ArrowLeft', (done) => {
      of(new KeyboardEvent('keydown', {key: 'ArrowLeft'})).pipe(eventKeyMap()).subscribe(v => {
        expect(v).toEqual(KeyService.LEFT_EVENT);
        done();
      });
    });
    it('should handle a', (done) => {
      of(new KeyboardEvent('keydown', {key: 'a'})).pipe(eventKeyMap()).subscribe(v => {
        expect(v).toEqual(KeyService.LEFT_EVENT);
        done();
      });
    });
    it('should handle ArrowRight', (done) => {
      of(new KeyboardEvent('keydown', {key: 'ArrowRight'})).pipe(eventKeyMap()).subscribe(v => {
        expect(v).toEqual(KeyService.RIGHT_EVENT);
        done();
      });
    });
    it('should handle d', (done) => {
      of(new KeyboardEvent('keydown', {key: 'd'})).pipe(eventKeyMap()).subscribe(v => {
        expect(v).toEqual(KeyService.RIGHT_EVENT);
        done();
      });
    });
    it('should handle sth else', (done) => {
      of(new KeyboardEvent('keydown', {key: 'b'})).pipe(eventKeyMap()).subscribe(v => {
        expect(v).toEqual(-1);
        done();
      });
    });
  });
});
