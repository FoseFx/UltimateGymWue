import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {sMap, TimetableComponent} from './timetable.component';
import {UiModule} from 'src/app/modules/ui/ui.module';
import {AppQuery} from 'src/app/state/app.query';
import {AppStore} from 'src/app/state/app.store';
import {KeyService} from '../../../../services/key.service';
import {of} from "rxjs";

describe('TimetableComponent', () => {
  let component: TimetableComponent;
  let fixture: ComponentFixture<TimetableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [UiModule],
      declarations: [ TimetableComponent ],
      providers: [KeyService, AppQuery, AppStore]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimetableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should watch for keys', () => {
    component.activeTab = 0;
    component.keyService.leftRightlistener$ = of(KeyService.RIGHT_EVENT);
    component.ngOnInit();
    expect(component.activeTab).toEqual(1);
    component.keyService.leftRightlistener$ = of(KeyService.LEFT_EVENT);
    component.ngOnInit();
    expect(component.activeTab).toEqual(0);
  });
  it('should pipe empty arr', (next) => {
    component.s$.subscribe((val) => {
      expect(val).toEqual([]);
      next();
    });
  });
  it('should pipe null', (next) => {
    of(null).pipe(sMap()).subscribe((val) => {
      expect(val).toEqual([[[{}]], [[{}]]]);
      next();
    });
  });

  it('should pipe array', (next) => {
    const arr = [[[{}, {}, {}, {}, {}, {}, {}], [{}, {}, {}, {}, {}, {}, {}], [{}, {}, {}, {}, {}, {}, {}], [{}, {}, {}, {}, {}, {}, {}], [{}, {}, {}, {}, {}, {}, {}]], [[{}, {}, {}, {}, {}, {}, {}], [{}, {}, {}, {}, {}, {}, {}], [{}, {}, {}, {}, {}, {}, {}], [{}, {}, {}, {}, {}, {}, {}], [{}, {}, {}, {}, {}, {}, {}]]];
    of(arr).pipe(sMap()).subscribe((val) => {
      expect(val).toEqual([[[{}, {}, {}, {}, {}], [{}, {}, {}, {}, {}], [{}, {}, {}, {}, {}], [{}, {}, {}, {}, {}], [{}, {}, {}, {}, {}], [{}, {}, {}, {}, {}], [{}, {}, {}, {}, {}]], [[{}, {}, {}, {}, {}], [{}, {}, {}, {}, {}], [{}, {}, {}, {}, {}], [{}, {}, {}, {}, {}], [{}, {}, {}, {}, {}], [{}, {}, {}, {}, {}], [{}, {}, {}, {}, {}]]]);
      next();
    });
  });

});
