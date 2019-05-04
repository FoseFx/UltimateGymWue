import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  selector: 'app-hr',
  templateUrl: './hr.component.html',
  styleUrls: ['./hr.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HrComponent {

  constructor() { }

}
