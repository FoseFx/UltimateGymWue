import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {debounceTime, map} from 'rxjs/operators';
import {tap} from 'rxjs/internal/operators/tap';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  animations: [
    trigger('dropdown', [
      state('void', style({transform: 'translateY(-20%)', opacity: '0'})),
      state('open', style({transform: 'translateY(0)', opacity: '1'})),
      transition('void <=> open', [animate('200ms')])
    ])
  ]
})
export class InputComponent implements OnInit, OnDestroy {

  @Input() type: 'text'|'email'|'number'|'password'|'dropdown' = 'text';
  @Input() allowBadPsw = false;
  @Input('value') preFilledValue = '';
  @Input('dropdownOptions')
  set dropdownOptions(val: string[] ) {
    this.ddOptions = val;
    this.value = '';
    this.ddFilterValue$.next('');
  }
  ddOptions: string[] = [];
  @Output() input = new EventEmitter();
  @Output() enter = new EventEmitter();
  focused = false;
  ddfocused = false;
  labelColored = false;
  private validSub: Subscription;
  public dirty = false;
  public value = '';
  public invalid = false;

  ddFilterValue$ = new BehaviorSubject('');

  dropdownOptionsVisible$: Observable<string[]> = this.ddFilterValue$.pipe(
    debounceTime(100),
    map((filter: string) => {
      const re = new RegExp(`.*${filter}.*`, 'i');
      return this.ddOptions.filter((val: string) => re.test(val));
    })
  );

  constructor() { }

  focusIn() {
    this.focused = true;
    this.ddfocused = true;
    this.labelColored = true;
  }

  focusOut(event: FocusEvent) {
    this.labelColored = false;
    const target: HTMLInputElement = (event.target) as HTMLInputElement;
    if (target.value.replace(/[\n\t ]/g, '').trim() === '') {
      this.focused = !this.focused;
    }
  }

  focusOutDD() {
    setTimeout(() => {
      if (this.value.replace(/[\n\t ]/g, '').trim() === '') {
        this.focused = false;
      }
      this.ddfocused = false;
      this.labelColored = false;
    }, 200);
  }

  onInput(event) {
    this.dirty = true;
    this.input.emit(event);
  }

  ngOnInit() {
    if (this.type !== 'dropdown') {
      this.validSub = this.input.pipe(
        debounceTime(100),
        eventValueMap(),
        tap((val: string) => this.value = val),
        this._inputValidMap()
      ).subscribe((valid: boolean) => {
        this.invalid = !valid;
      });
    }
  }

  ngOnDestroy() {
    try {
      this.validSub.unsubscribe();
    } catch (err) {

    }
  }


  dropdownSelect(value: string) {
    this.value = value;
    this.input.emit(value);
    this.dirty = true;
    this.ddFilterValue$.next('');
  }

  onDDInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this.ddFilterValue$.next(target.value);
  }

  _inputValidMap() {
    return map((input: string) => {
      if (this.type === 'text') {
        return input.length !== 0;
      } else if (this.type === 'password' && !this.allowBadPsw) {
        return input.length > 7;
      } else if (this.type === 'email') {
        // tslint:disable-next-line:max-line-length
        return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(input);
      } else { // number
        return true;
      }
    });
  }



}

export const eventValueMap = () => map((event: Event) => {
  const target = event.target as HTMLInputElement;
  return target.value as string;
});
