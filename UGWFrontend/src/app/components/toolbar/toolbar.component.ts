import {ChangeDetectionStrategy, Component} from '@angular/core';
import {AppService} from '../../state/app.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToolbarComponent {
  constructor(public service: AppService) { }
}
