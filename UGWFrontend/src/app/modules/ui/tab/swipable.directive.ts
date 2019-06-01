import {Directive, ElementRef, EventEmitter, HostListener, Input, Output} from '@angular/core';

@Directive({
  selector: '[appSwipable]'
})
export class SwipableDirective {

  startedAtX: number;
  percentAtStart: number;
  widthPerPage: number;
  N: number;
  newPercent: number;
  percentPerPage: number;
  moved = false;

  @Input('appSwipable') index: number;

  @Output() snapto = new EventEmitter<number>();

  @HostListener('touchstart', ['$event']) touchStart(event: TouchEvent) {

    const element = this.elRef.nativeElement as HTMLElement;

    this.N = element.childElementCount;
    this.percentAtStart = +element.style.transform.match(/translateX\(-?(\d+\.?(\d+)?)%?\)/)[1];
    this.percentAtStart = this.percentAtStart / (1 - 100);
    this.widthPerPage = element.scrollWidth / this.N;
    this.percentPerPage = 1 / this.N;


    const touch = event.targetTouches.item(0);
    if (touch === null) {
      return;
    }
    this.startedAtX = touch.clientX;
  }

  @HostListener('touchmove', ['$event']) touchMove(event: TouchEvent) {
    if (typeof this.startedAtX === 'undefined') {
      return;
    }
    const touch = event.targetTouches.item(0);
    if (touch === null) {
      return;
    }
    this.moved = true;
    const diff = touch.clientX - this.startedAtX; // diff in Richtung rechts gegangen

    if (diff > 0) { // swiped to left
      const isFirstPage = this.index === 0;
      if (isFirstPage) {
        return;
      }

    } else if (diff < 0) { // swiped to right
      const isLastPage = this.index === this.N - 1;
      if (isLastPage) {
        return;
      }
    }

    const changeOnPage = diff / this.widthPerPage;
    const percent = this.percentAtStart + changeOnPage * this.percentPerPage;
    this.newPercent = percent;
    (this.elRef.nativeElement as HTMLElement).style.transform = `translateX(${percent * 100}%)`; // set new percent
  }

  @HostListener('touchend', ['$event']) touchEnd(event: TouchEvent) {
    if (!this.moved) {
      return;
    }
    if (typeof this.newPercent === 'undefined') {
      this.newPercent = this.percentAtStart;
    }
    const diff = this.newPercent - this.percentAtStart;
    const el = this.elRef.nativeElement as HTMLElement;

    if (Math.abs(diff) > Math.abs(0.4 * this.percentPerPage)) { // snap to
      const add = diff < 0;
      const newIndex = this.index + (add ? 1 : -1);
      el.style.transform = `translateX(-${100 * (newIndex / this.N)}%)`;
      this.index = newIndex;
      this.snapto.emit(newIndex);
    } else { // snap back
      el.style.transform = `translateX(-${100 * (this.index / this.N)}%)`;
      this.snapto.emit(this.index);
    }


    // reset values
    this.startedAtX = undefined;
    this.N = undefined;
    this.widthPerPage = undefined;
    this.percentAtStart = undefined;
    this.newPercent = undefined;
    this.percentPerPage = undefined;
    this.moved = false;

  }

  @HostListener('touchcancel', ['$event']) touchCancel(event: TouchEvent) {
    this.touchEnd(event);
  }



  constructor(private elRef: ElementRef) {
  }

}
