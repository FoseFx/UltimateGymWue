import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthComponent } from './month.component';
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
});
