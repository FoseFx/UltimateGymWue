import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimetableComponent } from './timetable.component';
import { UiModule } from 'src/app/modules/ui/ui.module';
import { AppQuery } from 'src/app/state/app.query';
import { AppStore } from 'src/app/state/app.store';
import {KeyService} from '../../../../services/key.service';

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
});
