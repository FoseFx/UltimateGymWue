import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

@Component({
  selector: 'app-fab',
  templateUrl: './fab.component.html',
  styleUrls: ['./fab.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FabComponent {
  @Input() bgColor = '#223843';
  @Input() color = 'white';
}
