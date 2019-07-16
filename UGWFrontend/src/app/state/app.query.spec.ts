import {TestBed} from '@angular/core/testing';
import {
  abwochemap,
  AppQuery,
  basicHiddenNonKurseMap,
  basicStunenplanMap,
  basicVertretungsDatenMap,
  mixInHiddenNonKurse,
  removeHiddenNonKurse
} from './app.query';
import {AppStore, getVersion} from './app.store';
import {AppService} from './app.service';
import {SetupQuery} from '../modules/setup/state/setup.query';
import {SetupStore} from '../modules/setup/state/setup.store';
import {of} from 'rxjs';
import {TimeTable} from '../../types/TT';

describe('AppQuery', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AppQuery, AppStore, AppService, SetupQuery, SetupStore]
    });
  });
  it('should be created', () => {
    const query: AppQuery = TestBed.get(AppQuery);
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

  describe('abwochen', () => {

    it('should test abwochemap', (done) => {
      of(new Date(2019, 5, 19)).pipe(abwochemap()).subscribe((n: 0|1) => {
        expect(n).toEqual(1);
        done();
      });
    });

    it('should test abwochemap 2', (done) => {
      of(new Date(2019, 5, 24)).pipe(abwochemap()).subscribe((n: 0|1) => {
        expect(n).toEqual(0);
        done();
      });
    });

  });

  describe('tt', () => {

    describe('basicStunenplanMap', () => {

      it('should map to empty array if basics is null', (done) => {
        // @ts-ignore
        of(null).pipe(basicStunenplanMap()).subscribe((val) => {
          expect(val).toEqual([]);
          done();
        });
      });
      it('should map to Stundenplan (w/o info) if StundenplanWithInfos is not available', (done) => {
        // @ts-ignore
        of({stundenplan: 'no-infos'}).pipe(basicStunenplanMap()).subscribe((val) => {
          expect(val).toEqual('no-infos');
          done();
        });
      });

      it('should map to StundenplanWithInfos if available', (done) => {
        // @ts-ignore
        of({stundenplan: 'no-infos', stundenplanWithInfos: 'with-infos', }).pipe(basicStunenplanMap()).subscribe((val) => {
          expect(val).toEqual('with-infos');
          done();
        });
      });
    });

    describe('mixInHiddenNonKurse', () => {
      it('should work with no tt, but hiddenNoKurse set', (done) => {
        of([]).pipe(mixInHiddenNonKurse(of({hiddenNonKurse: ['test']}))).subscribe((val) => {
          expect(JSON.stringify(val)).toEqual(JSON.stringify([[], ['test']]));
          done();
        });
      });

      it('should work with tt, but no hiddenNoKurse set', (done) => {
        of(['sample']).pipe(mixInHiddenNonKurse(of({hiddenNonKurse: null}))).subscribe((val) => {
          expect(JSON.stringify(val)).toEqual(JSON.stringify([['sample'], []]));
          done();
        });
      });
      it('should work with tt and hiddenNoKurse set', (done) => {
        of(['sample']).pipe(mixInHiddenNonKurse(of({hiddenNonKurse: ['test']}))).subscribe((val) => {
          expect(JSON.stringify(val)).toEqual(JSON.stringify([['sample'], ['test']]));
          done();
        });
      });

    });

    describe('removeHiddenNonKurse', () => {

      it('should stay like it is, with no hiddenNonKurse', (done) => {
        // @ts-ignore
        of([['this', 'should', 'not', 'change or fail'], []]).pipe(removeHiddenNonKurse()).subscribe((val) => {
          expect(JSON.stringify(val)).toEqual(JSON.stringify(['this', 'should', 'not', 'change or fail']));
          done();
        });
      });

      it('should not error, with no tt, but with hiddenNonKurse', (done) => {
        // @ts-ignore
        of([[], ['test', 'mkey?']]).pipe(removeHiddenNonKurse()).subscribe((val) => {
          expect(JSON.stringify(val)).toEqual(JSON.stringify([]));
          done();
        });
      });

      it('should remove hiddennonkurse', (done) => {
        const tt: TimeTable = [
          [[{name: 'test1', typ: 'kurs', fach: 'test', raum: '000', lehrer: 'idk'},
            {name: 'test2', typ: 'klasse', fach: 'test', raum: '000', lehrer: 'idk'},
            {name: 'test4', typ: 'klasse', fach: 'test', raum: '000', lehrer: 'idk'},
            {name: 'test3', typ: 'kurs', fach: 'test', raum: '000', lehrer: 'idk'}], [], [], [], []],
          [[], [], [], [], []]
        ];
        of([tt, ['test2']]).pipe(removeHiddenNonKurse()).subscribe((val) => {
          expect(JSON.stringify(val)).toEqual(JSON.stringify([
            [[
              {name: 'test1', typ: 'kurs', fach: 'test', raum: '000', lehrer: 'idk'},
              {},
              {name: 'test4', typ: 'klasse', fach: 'test', raum: '000', lehrer: 'idk'},
              {name: 'test3', typ: 'kurs', fach: 'test', raum: '000', lehrer: 'idk'}], [], [], [], []],
            [[], [], [], [], []]
          ]));
          done();
        });
      });


    });

  });

  it('should test loginToken', () => {
    const query: AppQuery = TestBed.get(AppQuery);
    spyOn(query, 'getValue').and.returnValue({loginData: {token: 'this is a test'}});
    expect(query.loginToken).toEqual('Bearer this is a test');
  });

  it('should test credentialsToken', () => {
    const query: AppQuery = TestBed.get(AppQuery);
    spyOn(query, 'getValue').and.returnValue({credentials: {token: 'this is a test'}});
    expect(query.credentialsToken).toEqual('Bearer this is a test');
  });

  describe('basicHiddenNonKurseMap', () => {
    it('should return basicHiddenNonKurse', (done) => {
      // @ts-ignore
      of({hiddenNonKurse: 'something'}).pipe(basicHiddenNonKurseMap()).subscribe(v => {
        expect(v).toEqual(v);
        done();
      });
    });
    it('should return fallback if b not available', (done) => {
      // @ts-ignore
      of(null).pipe(basicHiddenNonKurseMap()).subscribe(v => {
        expect(v).toEqual([]);
        done();
      });
    });
  });

  describe('basicVertretungsDatenMap', () => {
    //   (b: AppStoreBasics) => !!b.vertretungsplan ? b.vertretungsplan : [null, null]
    it('should return vertretungsplan', (done) => {
      // @ts-ignore
      of({vertretungsplan: 'exist'}).pipe(basicVertretungsDatenMap()).subscribe((v) => {
        expect(v).toEqual('exist');
        done();
      });
    });
    it('should return fallback if vertretungsplan not available', (done) => {
      // @ts-ignore
      of({}).pipe(basicVertretungsDatenMap()).subscribe((v) => {
        expect(v).toEqual([null, null]);
        done();
      });
    });
  });

  it('should test version', () => {
    const query: AppQuery = TestBed.get(AppQuery);
    expect(query.version).toEqual(getVersion());
  });

  it('should test isLoggedin', () => {
    const query: AppQuery = TestBed.get(AppQuery);
    const spy = spyOn(query, 'getValue').and.returnValue({loginData: true});
    expect(query.isLoginned()).toEqual(true);
    spy.and.returnValue({});
    expect(query.isLoginned()).toEqual(false);
  });


});
