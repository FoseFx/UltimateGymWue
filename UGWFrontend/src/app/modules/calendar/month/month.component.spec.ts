import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MonthComponent} from './month.component';
import {HttpClientModule} from '@angular/common/http';
import {AppQuery} from '../../../state/app.query';
import {AppStore} from '../../../state/app.store';
import {environment} from '../../../../environments/environment';
import {of} from 'rxjs';

describe('MonthComponent', () => {
  let component: MonthComponent;
  let fixture: ComponentFixture<MonthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      declarations: [ MonthComponent ],
      providers: [AppQuery, AppStore]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getAmountOfDaysInMonth', () => {
    it('should return 31 on january', () => {
      jasmine.clock().install();
      jasmine.clock().mockDate(new Date(2019, 0, 1));
      fixture = TestBed.createComponent(MonthComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      expect(component.getAmountOfDaysInMonth()).toEqual(31);
      jasmine.clock().uninstall();
    });
    it('should return 28 on common year\'s february', () => {
      jasmine.clock().install();
      jasmine.clock().mockDate(new Date(2019, 1, 1));
      fixture = TestBed.createComponent(MonthComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      expect(component.getAmountOfDaysInMonth()).toEqual(28);
      jasmine.clock().uninstall();
    });

    it('should return 29 on special year\'s february', () => {
      jasmine.clock().install();
      jasmine.clock().mockDate(new Date(2020, 1, 1));
      fixture = TestBed.createComponent(MonthComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      expect(component.getAmountOfDaysInMonth()).toEqual(29);
      jasmine.clock().uninstall();
    });
    it('should return 31 on march', () => {
      jasmine.clock().install();
      jasmine.clock().mockDate(new Date(2019, 2, 1));
      fixture = TestBed.createComponent(MonthComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      expect(component.getAmountOfDaysInMonth()).toEqual(31);
      jasmine.clock().uninstall();
    });
    it('should return 30 on april', () => {
      jasmine.clock().install();
      jasmine.clock().mockDate(new Date(2019, 3, 1));
      fixture = TestBed.createComponent(MonthComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      expect(component.getAmountOfDaysInMonth()).toEqual(30);
      jasmine.clock().uninstall();
    });
    it('should return 31 on may', () => {
      jasmine.clock().install();
      jasmine.clock().mockDate(new Date(2019, 4, 1));
      fixture = TestBed.createComponent(MonthComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      expect(component.getAmountOfDaysInMonth()).toEqual(31);
      jasmine.clock().uninstall();
    });
    it('should return 30 on june', () => {
      jasmine.clock().install();
      jasmine.clock().mockDate(new Date(2019, 5, 1));
      fixture = TestBed.createComponent(MonthComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      expect(component.getAmountOfDaysInMonth()).toEqual(30);
      jasmine.clock().uninstall();
    });
    it('should return 31 on july', () => {
      jasmine.clock().install();
      jasmine.clock().mockDate(new Date(2019, 6, 1));
      fixture = TestBed.createComponent(MonthComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      expect(component.getAmountOfDaysInMonth()).toEqual(31);
      jasmine.clock().uninstall();
    });
    it('should return 31 on august', () => {
      jasmine.clock().install();
      jasmine.clock().mockDate(new Date(2019, 7, 1));
      fixture = TestBed.createComponent(MonthComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      expect(component.getAmountOfDaysInMonth()).toEqual(31);
      jasmine.clock().uninstall();
    });
    it('should return 30 on september', () => {
      jasmine.clock().install();
      jasmine.clock().mockDate(new Date(2019, 8, 1));
      fixture = TestBed.createComponent(MonthComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      expect(component.getAmountOfDaysInMonth()).toEqual(30);
      jasmine.clock().uninstall();
    });
    it('should return 31 on october', () => {
      jasmine.clock().install();
      jasmine.clock().mockDate(new Date(2019, 9, 1));
      fixture = TestBed.createComponent(MonthComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      expect(component.getAmountOfDaysInMonth()).toEqual(31);
      jasmine.clock().uninstall();
    });
    it('should return 30 on november', () => {
      jasmine.clock().install();
      jasmine.clock().mockDate(new Date(2019, 10, 1));
      fixture = TestBed.createComponent(MonthComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      expect(component.getAmountOfDaysInMonth()).toEqual(30);
      jasmine.clock().uninstall();
    });
    it('should return 31 on december', () => {
      jasmine.clock().install();
      jasmine.clock().mockDate(new Date(2019, 11, 1));
      fixture = TestBed.createComponent(MonthComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      expect(component.getAmountOfDaysInMonth()).toEqual(31);
      jasmine.clock().uninstall();
    });

  });

  describe('isLeapYear', () => {
    it('should return false', () => {
      expect(MonthComponent.isLeapYear(new Date(2019, 0, 1))).toEqual(false);
    });
    it('should return true', () => {
      expect(MonthComponent.isLeapYear(new Date(2020, 0, 1))).toEqual(true);
    });
    it('should return true', () => {
      expect(MonthComponent.isLeapYear(new Date(1980, 0, 1))).toEqual(true);
    });
    it('should return false', () => {
      expect(MonthComponent.isLeapYear(new Date(2100, 0, 1))).toEqual(false);
    });
    it('should return true', () => {
      expect(MonthComponent.isLeapYear(new Date(2000, 0, 1))).toEqual(true);
    });
  });

  it('should convert now to Query', () => {
    jasmine.clock().install();
    jasmine.clock().mockDate(new Date(2019, 1, 1));
    fixture = TestBed.createComponent(MonthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.query()).toEqual('2019-02');
    jasmine.clock().uninstall();
  });

  it('should convert now to Query x2', () => {
    jasmine.clock().install();
    jasmine.clock().mockDate(new Date(2019, 11, 1));
    fixture = TestBed.createComponent(MonthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.query()).toEqual('2019-12');
    jasmine.clock().uninstall();
  });

  describe('onAfterInit', () => {

    it('should call correct route', () => {
      component.offset = 5;
      component.month = [undefined, undefined, undefined, undefined, undefined, [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []];
      spyOn(component, 'query').and.returnValue('2019-12');
      spyOn(component.appQuery, 'hasCredentials').and.returnValue(true);
      spyOn(component.appQuery, 'getValue').and.returnValue({loginData: {token: 'some-token'}});
      spyOn(component.http, 'get').and.callFake((url, config) => {
        expect(url).toEqual(environment.urls.getEvents + '2019-12');
        expect(config).toEqual({
          headers: {
            Authorization: 'Bearer some-token'
          }
        });
        return of({data: [
            {name: '1', typ: 'ferientag', format: 'fullday', begin: +new Date(2019, 11, 1)},
            {name: '2', typ: 'ferien', format: 'ferien', begin: +new Date(2019, 11, 2), end: +new Date(2019, 11, 4)},
            {name: '3', typ: 'sonder', format: 'time', begin: +new Date(2019, 11, 4, 19), end: +new Date(2019, 11, 5, 1)},
            {name: '4', typ: 'klausur', format: 'schule', begin: +('3' + Math.floor(+new Date(2019, 11, 6) / 100)), end: +('4' + Math.floor(+new Date(2019, 11, 6) / 100))},
        ], error: false});
      });
      component.ngAfterViewInit();
      // @ts-ignore
      expect(component.month[5]).toEqual([{name: '1', typ: 'ferientag', format: 'fullday', begin: +new Date(2019, 11, 1)}]);
      // @ts-ignore
      expect(component.month[6]).toEqual([{name: '2', typ: 'ferien', format: 'ferien', begin: +new Date(2019, 11, 2), end: +new Date(2019, 11, 4)}]);
      // @ts-ignore
      expect(component.month[7]).toEqual([{name: '2', typ: 'ferien', format: 'ferien', begin: +new Date(2019, 11, 2), end: +new Date(2019, 11, 4)}]);
      // @ts-ignore
      expect(component.month[8]).toEqual([
        {name: '2', typ: 'ferien', format: 'ferien', begin: +new Date(2019, 11, 2), end: +new Date(2019, 11, 4)},
        {name: '3', typ: 'sonder', format: 'time', begin: +new Date(2019, 11, 4, 19), end: +new Date(2019, 11, 5, 1)}
      ]);
      // @ts-ignore
      expect(component.month[9]).toEqual([{name: '3', typ: 'sonder', format: 'time', begin: +new Date(2019, 11, 4, 19), end: +new Date(2019, 11, 5, 1)}]);
      // @ts-ignore
      expect(component.month[10]).toEqual([{name: '4', typ: 'klausur', format: 'schule', begin: +new Date(2019, 11, 6), beginSchulStunde: 3, end: +('4' + Math.floor(+new Date(2019, 11, 6) / 100))}]);
    });
  });

});
