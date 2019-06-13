import {Directive, HostListener} from '@angular/core';

@Directive({
  selector: '[appNotSwipable]'
})
export class NotSwipableDirective {

  constructor() { }

  /* Because Events get emitted to
  *  the targeted ('most specific') Element (this Directive)
  *  these functions are called before the Swipeable-Directives ones.
  *  In these functions the blobbing of the Events gets stopped
  *  before the Swipeable Directive can react to it.
  */
  @HostListener('touchstart', ['$event']) func(event) {
    if (this.shouldBlock(event)) {
      event.stopPropagation();
    }
  }
  @HostListener('touchmove', ['$event']) func2(event) {
    if (this.shouldBlock(event)) {
      event.stopPropagation();
    }
  }
  @HostListener('touchend', ['$event']) func3(event) {
    if (this.shouldBlock(event)) {
      event.stopPropagation();
    }
  }

  shouldBlock(event: Event): boolean {
    const t = event.target as HTMLElement;
    return t.scrollWidth > t.offsetWidth;
  }
}
