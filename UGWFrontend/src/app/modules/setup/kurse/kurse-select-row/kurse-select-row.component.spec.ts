import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KurseSelectRowComponent } from './kurse-select-row.component';

describe('KurseSelectRowComponent', () => {
  let component: KurseSelectRowComponent;
  let fixture: ComponentFixture<KurseSelectRowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KurseSelectRowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KurseSelectRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
