import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StufeComponent } from './stufe.component';
import {UiModule} from '../../ui/ui.module';

describe('StufeComponent', () => {
  let component: StufeComponent;
  let fixture: ComponentFixture<StufeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [UiModule],
      declarations: [ StufeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StufeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
