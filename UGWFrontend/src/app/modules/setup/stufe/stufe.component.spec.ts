import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StufeComponent } from './stufe.component';

describe('StufeComponent', () => {
  let component: StufeComponent;
  let fixture: ComponentFixture<StufeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
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
