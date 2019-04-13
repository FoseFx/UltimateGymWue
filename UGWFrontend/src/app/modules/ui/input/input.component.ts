import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent implements OnInit {

  @Input() type: 'text'|'email'|'number' = 'text';
  focused = false;
  labelColored = false;

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

  ngOnInit() {
  }

}
