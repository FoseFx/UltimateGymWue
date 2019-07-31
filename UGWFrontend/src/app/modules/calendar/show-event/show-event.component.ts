import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {SchoolEvent} from '../../../../types/Event';
import {capitalizeFirstLetter} from '../../../util';

@Component({
  selector: 'app-show-event',
  templateUrl: './show-event.component.html',
  styleUrls: ['./show-event.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShowEventComponent  {
  @Input() event: SchoolEvent;
  @Output() close = new EventEmitter();

  capitalizeFL = capitalizeFirstLetter;
}
