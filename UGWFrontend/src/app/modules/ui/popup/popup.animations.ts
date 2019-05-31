import {animate, animateChild, group, query, state, style, transition, trigger} from '@angular/animations';

export const PopupFadeAnimation = trigger('popupOpenClose', [
  state('open', style({
    opacity: 1
  })),
  state('void', style({
    opacity: 0
  })),
  transition('open <=> void', [
    group([
      query('@popupWindowOpenClose', animateChild()),
      animate('100ms')
    ])
  ])
]);


export const PopupWindowAnimation = trigger('popupWindowOpenClose', [
  state('open', style({
    transform: 'scale(1) translateY(-56px)'
  })),
  state('void', style({
    transform: 'scale(0) translateY(-56px)'
  })),
  transition('open <=> void', [
    animate('200ms')
  ])
]);

