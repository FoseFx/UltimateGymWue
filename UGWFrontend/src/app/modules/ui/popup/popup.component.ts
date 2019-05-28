import {ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Output} from '@angular/core';
import {PopupFadeAnimation, PopupWindowAnimation} from './popup.animations';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    PopupFadeAnimation,
    PopupWindowAnimation
  ]
})
export class PopupComponent {

  @HostBinding('@popupOpenClose') get anim() { return 'open'; }

  @Output() close = new EventEmitter();
  constructor() { }

}
