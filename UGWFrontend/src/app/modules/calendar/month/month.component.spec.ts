import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MonthComponent} from './month.component';
import {HttpClientModule} from '@angular/common/http';
import {AppQuery} from '../../../state/app.query';
import {AppStore} from '../../../state/app.store';

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

});
