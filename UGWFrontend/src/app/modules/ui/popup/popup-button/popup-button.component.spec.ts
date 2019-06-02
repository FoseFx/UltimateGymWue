import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupButtonComponent } from './popup-button.component';

describe('PopupButtonComponent', () => {
  let component: PopupButtonComponent;
  let fixture: ComponentFixture<PopupButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopupButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
