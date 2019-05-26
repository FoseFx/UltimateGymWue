import {inject, TestBed} from '@angular/core/testing';
import {AppQuery} from './app.query';
import {AppStore} from './app.store';
import {AppService} from './app.service';
import {SetupQuery} from '../modules/setup/state/setup.query';
import {SetupStore} from '../modules/setup/state/setup.store';
import {of} from 'rxjs';

describe('AppQuery', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AppQuery, AppStore, AppService, SetupQuery, SetupStore]
    });
  });
  it('should be created', () => {
    const query: SetupQuery = TestBed.get(SetupQuery);
    expect(query).toBeTruthy();
  });

  describe('dates', () => {

    describe('today', () => {

      it('today should stay the same on Mo', (done) => {
        const query: AppQuery = TestBed.get(AppQuery);
        spyOn(query, 'select').and.returnValue(of(null));
        jasmine.clock().install();
        const refDate = new Date(2019, 4, 13);
        jasmine.clock().mockDate(refDate);
        query.today$.subscribe((val: Date) => {
          console.log('mo', val);
          expect(+val).toEqual(+refDate);
          done();
        });
        jasmine.clock().uninstall();
      });
      it('today should stay the same on Di', (done) => {
        const query: AppQuery = TestBed.get(AppQuery);
        spyOn(query, 'select').and.returnValue(of(null));
        jasmine.clock().install();
        const refDate = new Date(2019, 4, 14);
        jasmine.clock().mockDate(refDate);
        query.today$.subscribe((val: Date) => {
          expect(+val).toEqual(+refDate);
          done();
        });
        jasmine.clock().uninstall();
      });
      it('today should stay the same on Mi', (done) => {
        const query: AppQuery = TestBed.get(AppQuery);
        spyOn(query, 'select').and.returnValue(of(null));
        jasmine.clock().install();
        const refDate = new Date(2019, 4, 15);
        jasmine.clock().mockDate(refDate);
        query.today$.subscribe((val: Date) => {
          expect(+val).toEqual(+refDate);
          done();
        });
        jasmine.clock().uninstall();
      });
      it('today should stay the same on Do', (done) => {
        const query: AppQuery = TestBed.get(AppQuery);
        spyOn(query, 'select').and.returnValue(of(null));
        jasmine.clock().install();
        const refDate = new Date(2019, 4, 16);
        jasmine.clock().mockDate(refDate);
        query.today$.subscribe((val: Date) => {
          expect(+val).toEqual(+refDate);
          done();
        });
        jasmine.clock().uninstall();
      });
      it('today should stay the same on Fr', (done) => {
        const query: AppQuery = TestBed.get(AppQuery);
        spyOn(query, 'select').and.returnValue(of(null));
        jasmine.clock().install();
        const refDate = new Date(2019, 4, 17);
        jasmine.clock().mockDate(refDate);
        query.today$.subscribe((val: Date) => {
          expect(+val).toEqual(+refDate);
          done();
        });
        jasmine.clock().uninstall();
      });
      it('today should move to next Mo on Sa', (done) => {
        const query: AppQuery = TestBed.get(AppQuery);
        spyOn(query, 'select').and.returnValue(of(null));
        jasmine.clock().install();
        const refDate = new Date(2019, 4, 18);
        const expRefDate = new Date(2019, 4, 20);
        jasmine.clock().mockDate(refDate);
        query.today$.subscribe((val: Date) => {
          expect(+val).toEqual(+expRefDate);
          done();
        });
        jasmine.clock().uninstall();
      });
      it('today should move to next Mo on So', (done) => {
        const query: AppQuery = TestBed.get(AppQuery);
        spyOn(query, 'select').and.returnValue(of(null));
        jasmine.clock().install();
        const refDate = new Date(2019, 4, 19);
        const expRefDate = new Date(2019, 4, 20);
        jasmine.clock().mockDate(refDate);
        query.today$.subscribe((val: Date) => {
          expect(+val).toEqual(+expRefDate);
          done();
        });
        jasmine.clock().uninstall();
      });

    });

    describe('next day', () => {
      it('tomorrow should be Di on Mo', (done) => {
        const query: AppQuery = TestBed.get(AppQuery);
        spyOn(query, 'select').and.returnValue(of(null));
        jasmine.clock().install();
        const refDate = new Date(2019, 4, 13);
        const resRefDate = new Date(2019, 4, 14);
        jasmine.clock().mockDate(refDate);
        query.nextDay$.subscribe((val: Date) => {
          console.log('mo', val);
          expect(+val).toEqual(+resRefDate);
          done();
        });
        jasmine.clock().uninstall();
      });
      it('tomorrow should be Mi on Di', (done) => {
        const query: AppQuery = TestBed.get(AppQuery);
        spyOn(query, 'select').and.returnValue(of(null));
        jasmine.clock().install();
        const refDate = new Date(2019, 4, 14);
        const resRefDate = new Date(2019, 4, 15);
        jasmine.clock().mockDate(refDate);
        query.nextDay$.subscribe((val: Date) => {
          console.log('mo', val);
          expect(+val).toEqual(+resRefDate);
          done();
        });
        jasmine.clock().uninstall();
      });
      it('tomorrow should be Do on Mi', (done) => {
        const query: AppQuery = TestBed.get(AppQuery);
        spyOn(query, 'select').and.returnValue(of(null));
        jasmine.clock().install();
        const refDate = new Date(2019, 4, 15);
        const resRefDate = new Date(2019, 4, 16);
        jasmine.clock().mockDate(refDate);
        query.nextDay$.subscribe((val: Date) => {
          console.log('mo', val);
          expect(+val).toEqual(+resRefDate);
          done();
        });
        jasmine.clock().uninstall();
      });
      it('tomorrow should be Fr on Do', (done) => {
        const query: AppQuery = TestBed.get(AppQuery);
        spyOn(query, 'select').and.returnValue(of(null));
        jasmine.clock().install();
        const refDate = new Date(2019, 4, 16);
        const resRefDate = new Date(2019, 4, 17);
        jasmine.clock().mockDate(refDate);
        query.nextDay$.subscribe((val: Date) => {
          console.log('mo', val);
          expect(+val).toEqual(+resRefDate);
          done();
        });
        jasmine.clock().uninstall();
      });
      it('tomorrow should be Mo on Fr', (done) => {
        const query: AppQuery = TestBed.get(AppQuery);
        spyOn(query, 'select').and.returnValue(of(null));
        jasmine.clock().install();
        const refDate = new Date(2019, 4, 17);
        const resRefDate = new Date(2019, 4, 20);
        jasmine.clock().mockDate(refDate);
        query.nextDay$.subscribe((val: Date) => {
          console.log('mo', val);
          expect(+val).toEqual(+resRefDate);
          done();
        });
        jasmine.clock().uninstall();
      });
      it('tomorrow should be Di on Sa', (done) => {
        const query: AppQuery = TestBed.get(AppQuery);
        spyOn(query, 'select').and.returnValue(of(null));
        jasmine.clock().install();
        const refDate = new Date(2019, 4, 18);
        const resRefDate = new Date(2019, 4, 21);
        jasmine.clock().mockDate(refDate);
        query.nextDay$.subscribe((val: Date) => {
          console.log('mo', val);
          expect(+val).toEqual(+resRefDate);
          done();
        });
        jasmine.clock().uninstall();
      });
      it('tomorrow should be Di on So', (done) => {
        const query: AppQuery = TestBed.get(AppQuery);
        spyOn(query, 'select').and.returnValue(of(null));
        jasmine.clock().install();
        const refDate = new Date(2019, 4, 19);
        const resRefDate = new Date(2019, 4, 21);
        jasmine.clock().mockDate(refDate);
        query.nextDay$.subscribe((val: Date) => {
          console.log('mo', val);
          expect(+val).toEqual(+resRefDate);
          done();
        });
        jasmine.clock().uninstall();
      });

    });

    it('should return 0 for abwoche$ on A woche', (done) => {
      const query: AppQuery = TestBed.get(AppQuery);
      spyOn(query, 'select').and.returnValue(of(null));
      jasmine.clock().install();
      const refDate = new Date(2019, 4, 14);
      jasmine.clock().mockDate(refDate);
      query.abwoche$.subscribe((val: 0|1) => {
        expect(val).toEqual(0);
        done();
      });
      jasmine.clock().uninstall();
    });

    it('should return 1 for abwoche$ on B Woche', (done) => {
      const query: AppQuery = TestBed.get(AppQuery);
      spyOn(query, 'select').and.returnValue(of(null));
      jasmine.clock().install();
      const refDate = new Date(2019, 4, 20);
      jasmine.clock().mockDate(refDate);
      query.abwoche$.subscribe((val: 0|1) => {
        expect(val).toEqual(1);
        done();
      });
      jasmine.clock().uninstall();
    });


    it('toNextDay should skip to next day', () => {
      const query: AppQuery = TestBed.get(AppQuery);
      const date1 = new Date(2019, 4, 15); // Mi
      expect(+query._toNextDay(date1)).toEqual(+date1);

      const date2 = new Date(2019, 4, 18); // Sa
      const date2res = new Date(2019, 4, 20); // Mo
      expect(+query._toNextDay(date2)).toEqual(+date2res);
    });


  });

});
