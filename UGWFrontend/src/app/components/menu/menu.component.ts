import {Component} from '@angular/core';
import {AppQuery} from '../../state/app.query';
import {AppService} from '../../state/app.service';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {NotificationService} from '../../services/notification.service';

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

  comp = this;

  constructor(public query: AppQuery, public service: AppService, public notificationService: NotificationService) { }
  // tslint:disable-next-line
  menuItems = [
    {name: 'Home', icon: 'home', route: '/', cond: tru},
    {name: 'User', icon: 'account_circle', route: '/user', cond: isLoggedIn},
    {name: 'Stundenplan', icon: 'date_range', route: '/basics/stundenplan', cond: isLoggedIn},
    {name: 'Kalender', icon: 'event', route: '/calendar', cond: isLoggedIn},
    {name: 'Klausuren', icon: 'assignment', route: '/setup/basics/klausuren', cond: isLoggedIn},
    {name: 'Versteckte Stunden', icon: 'not_interested', route: '/basics/hide', cond: isLoggedIn},
    {name: 'Benachrichtigungen', icon: 'textsms', route: '/basics/notification', cond: isLoggedInAndHasPushSupport},
  ];

}

export const isLoggedIn = (ctx: MenuComponent) => ctx.query.isLoginned();
export const tru = (...args) => true;
export const isLoggedInAndHasPushSupport = (ctx: MenuComponent) => isLoggedIn(ctx) && ctx.notificationService.canPush();
