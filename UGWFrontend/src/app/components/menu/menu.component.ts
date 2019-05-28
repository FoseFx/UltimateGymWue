import {Component} from '@angular/core';
import {AppQuery} from '../../state/app.query';
import {AppService} from '../../state/app.service';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  animations: [
    trigger('menuOpen', [
      state('open', style({
        transform: 'none'
      })),
      state('void', style({
        transform: 'translateX(-380px)'
      })),
      transition('open <=> void', [
        animate('100ms')
      ])
    ]),
    trigger('backdropVisible', [
      state('open', style({
        opacity: 0.4
      })),
      state('void', style({
        opacity: 0
      })),
      transition('open <=> void', [
        animate('100ms')
      ])
    ]),

  ]
})
export class MenuComponent {

  constructor(public query: AppQuery, public service: AppService) { }

}
