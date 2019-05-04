import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonComponent {

  @Input() swap = false;
  @Input() accent = false;
  @Input() disabled = false;
  constructor() { }

}
