import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatedMonthsComponent } from './related-months.component';
import {MonthComponent} from '../month/month.component';
import {UiModule} from '../../ui/ui.module';
import {AppQuery} from '../../../state/app.query';
import {AppStore} from '../../../state/app.store';
import {ShowEventComponent} from '../show-event/show-event.component';
import {HttpClientModule} from '@angular/common/http';

describe('RelatedMonthsComponent', () => {
  let component: RelatedMonthsComponent;
  let fixture: ComponentFixture<RelatedMonthsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, UiModule],
      declarations: [ RelatedMonthsComponent, MonthComponent, ShowEventComponent ],
      providers: [AppQuery, AppStore]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RelatedMonthsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('date', () => {
    it('should just change month', () => {
      component.currentMonth = 5;
      component.currentYear = 2019;
      component.monthDelta = 2;
      const newDate = component.date;
      expect(newDate.getFullYear()).toBe(component.currentYear);
      expect(newDate.getMonth()).toBe(component.currentMonth + component.monthDelta);
    });
    it('should change year downwards', () => {
      component.currentMonth = 2;
      component.currentYear = 2019;
      component.monthDelta = -4;
      const newDate = component.date;
      expect(newDate.getFullYear()).toBe(component.currentYear - 1);
      expect(newDate.getMonth()).toBe(10);
    });
    it('should change year upwards', () => {
      component.currentMonth = 10;
      component.currentYear = 2019;
      component.monthDelta = 4;
      const newDate = component.date;
      expect(newDate.getFullYear()).toBe(component.currentYear + 1);
      expect(newDate.getMonth()).toBe(2);
    });
    it('should change year upwards three times', () => {
      component.currentMonth = 10;
      component.currentYear = 2019;
      component.monthDelta = 36;
      const newDate = component.date;
      expect(newDate.getFullYear()).toBe(component.currentYear + 3);
      expect(newDate.getMonth()).toBe(10);
    });
  });

  describe('monthChange', () => {
    it('should not change when minimum', () => {
      component.show = true;
      component.monthDelta = -4;
      component.monthChanged(MonthComponent.EVENT_PREV_MONTH);
      expect(component.monthDelta).toBe(-4);
      expect(component.show).toBe(true);
    });
    it('should not change when maximum', () => {
      component.show = true;
      component.monthDelta = 24;
      component.monthChanged(MonthComponent.EVENT_NEXT_MONTH);
      expect(component.monthDelta).toBe(24);
      expect(component.show).toBe(true);
    });
    it('should change', () => {
      component.show = true;
      component.monthDelta = 4;
      component.monthChanged(MonthComponent.EVENT_NEXT_MONTH);
      expect(component.monthDelta).toBe(5);
      expect(component.show).toBe(false);
    });
    it('should change x2', () => {
      component.show = true;
      component.monthDelta = 4;
      component.monthChanged(MonthComponent.EVENT_PREV_MONTH);
      expect(component.monthDelta).toBe(3);
      expect(component.show).toBe(false);
    });
  });
});
