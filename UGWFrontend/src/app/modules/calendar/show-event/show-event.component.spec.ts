import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ShowEventComponent} from './show-event.component';
import {UiModule} from '../../ui/ui.module';

describe('ShowEventComponent', () => {
  let component: ShowEventComponent;
  let fixture: ComponentFixture<ShowEventComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [UiModule],
      declarations: [ ShowEventComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
