import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {eventValueMap, InputComponent} from './input.component';
import {of} from "rxjs";

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

  it('should focusIn', () => {
    component.focused = false;
    component.ddfocused = false;
    component.labelColored = false;

    component.focusIn();

    expect(component.focused).toEqual(true);
    expect(component.ddfocused).toEqual(true);
    expect(component.labelColored).toEqual(true);

  });

  describe('focusOut', () => {
    it('should ', () => {

      component.labelColored = true;
      component.focused = true;

      // @ts-ignore
      component.focusOut({target: {value: '\t\n  \n\n\t\t'}});

      expect(component.labelColored).toEqual(false);
      expect(component.focused).toEqual(false);
    });

    it('should ', () => {

      component.labelColored = true;
      component.focused = true;

      // @ts-ignore
      component.focusOut({target: {value: '\t\n Content \n\n\t\t'}});

      expect(component.labelColored).toEqual(false);
      expect(component.focused).toEqual(true);
    });

  });

  it('dropdownSelect', () => {

    component.dropdownSelect('value');

    component.input.subscribe(v => expect(v).toEqual('value'));

    expect(component.ddFilterValue$.getValue()).toEqual('');
    expect(component.dirty).toEqual(true);
    expect(component.value).toEqual('value');

  });

  it('onDDInput', () => {
    // @ts-ignore
    component.onDDInput({target: {value: 'value2'}});
    expect(component.ddFilterValue$.getValue()).toEqual('value2');
  });

  describe('focusOutDD', () => {
    it('should ', fakeAsync(() => {
      component.focused = true;
      component.ddfocused = true;
      component.labelColored = true;
      component.value = '';
      component.focusOutDD();
      tick(210);
      expect(component.ddfocused).toEqual(false);
      expect(component.labelColored).toEqual(false);
      expect(component.focused).toEqual(false);
    }));
    it('should ', fakeAsync(() => {
      component.focused = true;
      component.ddfocused = true;
      component.labelColored = true;
      component.value = 'Some';
      component.focusOutDD();
      tick(210);
      expect(component.ddfocused).toEqual(false);
      expect(component.labelColored).toEqual(false);
      expect(component.focused).toEqual(true);
    }));
  });

  it('should test eventValueMap', (done) => {
    // @ts-ignore
    of({target: {value: 'some-val'}}).pipe(eventValueMap()).subscribe(b => {
      expect(b).toEqual('some-val');
      done();
    });
  });

  describe('_inputValidMap', () => {
    it('should test type === text', (done) => {
      component.type = 'text';
      of('test').pipe(component._inputValidMap()).subscribe((b) => {
        expect(b).toEqual(true);
        of('').pipe(component._inputValidMap()).subscribe((bb) => {
          expect(bb).toEqual(false);
          done();
        });
      });

    });

    it('should test type === password and not allowedBadPasw', (done) => {
      component.type = 'password';
      component.allowBadPsw = false;
      of('testtesttest').pipe(component._inputValidMap()).subscribe((b) => {
        expect(b).toEqual(true);
        of('').pipe(component._inputValidMap()).subscribe((bb) => {
          expect(bb).toEqual(false);
          of('test').pipe(component._inputValidMap()).subscribe((bbb) => {
            expect(bbb).toEqual(false);
            done();
          });
        });
      });
    });

    it('should test type === email', (done) => {
      component.type = 'email';
      of('test@test.com').pipe(component._inputValidMap()).subscribe((b) => {
        expect(b).toEqual(true);
        of('').pipe(component._inputValidMap()).subscribe((bb) => {
          expect(bb).toEqual(false);
          done();
        });
      });
    });

    it('should test else', (done) => {
      component.type = 'password';
      component.allowBadPsw = true;
      of('jsdia').pipe(component._inputValidMap()).subscribe((b) => {
        expect(b).toEqual(true);
        component.type = 'number';
        of('123').pipe(component._inputValidMap()).subscribe((bb) => {
          expect(bb).toEqual(true);
          done();
        });

      });

    });

  });

  describe('dropdownOptionsVisible$', () => {
    it('should ', (done) => {
      component.ddFilterValue$.next('test');
      component.ddOptions = ['test1', 'test2', 'else'];
      component.dropdownOptionsVisible$.subscribe(arr => {
        expect(arr).toEqual(['test1', 'test2']);
        done();
      });
    });
  });

});
