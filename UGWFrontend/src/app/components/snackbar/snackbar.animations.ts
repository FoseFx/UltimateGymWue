import {animate, state, style, transition, trigger} from '@angular/animations';


export const SnackbarAnimation = trigger('snackbarState', [
  state('visible', style({
    transform: 'translateY(0)',
    opacity: '1'
  })),
  state('invisible', style({
    transform: 'translateY(200px)',
    opacity: '0'
  })),
  state('void', style({
    transform: 'translateY(200px)',
    opacity: '0'
  })),
  transition('visible <=> invisible', animate('0.2s')),
  transition('visible <=> void', animate('0.2s'))
]);



export const SnackbarAnimations = [
  SnackbarAnimation
];
