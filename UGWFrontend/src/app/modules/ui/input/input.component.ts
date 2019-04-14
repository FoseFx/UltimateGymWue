import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent implements OnInit {

  @Input() type: 'text'|'email'|'number' = 'text';
  @Output() input = new EventEmitter();
  private focused = false;
  private labelColored = false;
  public dirty = false;

  constructor() { }

  private focusIn() {
    this.focused = true;
    this.labelColored = true;
  }

  private focusOut(event: FocusEvent) {
    this.labelColored = false;
    const target: HTMLInputElement = (event.target) as HTMLInputElement;
    if (target.value.replace(/[\n\t ]/g, '').trim() === '') {
      this.focused = !this.focused;
    }
  }

  private onInput(event) {
    this.dirty = true;
    this.input.emit(event);
  }

  ngOnInit() {
  }

}
