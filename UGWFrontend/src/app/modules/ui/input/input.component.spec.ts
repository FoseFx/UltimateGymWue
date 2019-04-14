import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputComponent } from './input.component';

describe('InputComponent', () => {
  let component: InputComponent;
  let fixture: ComponentFixture<InputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be dirty after first input', () => {
    expect(component.dirty).toEqual(false);
    // @ts-ignore
    component.onInput({});
    expect(component.dirty).toEqual(true);
  });

  it('should pass "input" event to @Output "input"', (done) => {
    const EVENT = {someUnique: 'value'};
    component.input.subscribe((event) => {
      expect(JSON.stringify(event)).toEqual(JSON.stringify(EVENT));
      done();
    });
    // @ts-ignore
    component.onInput(EVENT);

  });


});
