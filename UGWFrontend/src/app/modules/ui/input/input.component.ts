import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Subscription} from 'rxjs';
import {debounceTime, map} from 'rxjs/operators';
import {tap} from "rxjs/internal/operators/tap";

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent implements OnInit, OnDestroy {

  @Input() type: 'text'|'email'|'number'|'password' = 'text';
  @Output() input = new EventEmitter();
  @Output() enter = new EventEmitter();
  focused = false;
  labelColored = false;
  private validSub: Subscription;
  public dirty = false;
  public value = '';
  public invalid = false;

  constructor() { }

  focusIn() {
    this.focused = true;
    this.labelColored = true;
  }

  focusOut(event: FocusEvent) {
    this.labelColored = false;
    const target: HTMLInputElement = (event.target) as HTMLInputElement;
    if (target.value.replace(/[\n\t ]/g, '').trim() === '') {
      this.focused = !this.focused;
    }
  }

  onInput(event) {
    this.dirty = true;
    this.input.emit(event);
  }

  ngOnInit() {
    this.validSub = this.input.pipe(
      debounceTime(100),
      map((event: Event) => {
        const target = event.target as HTMLInputElement;
        return target.value;
      }),
      tap((val) => this.value = val),
      map((input) => {
        if (this.type === 'text') {
          return input.length !== 0;
        } else if (this.type === 'password') {
          return input.length > 7;
        } else if (this.type === 'email') {
          return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(input);
        } else { // number
          return true;
        }
      })
    ).subscribe((valid: boolean) => {
      this.invalid = !valid;
    });
  }

  ngOnDestroy() {
    this.validSub.unsubscribe();
  }



}
