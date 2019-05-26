import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StufeVertretungComponent } from './stufe-vertretung.component';

describe('StufeVertretungComponent', () => {
  let component: StufeVertretungComponent;
  let fixture: ComponentFixture<StufeVertretungComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StufeVertretungComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StufeVertretungComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
