import {SwipableDirective} from './swipable.directive';
import {Component, DebugElement} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';


@Component({
  template: `<div [appSwipable]></div>`
})
class TestComponent {
}

describe('SwipableDirective', () => {

  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let inputEl: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent, SwipableDirective]
    });
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    inputEl = fixture.debugElement.query(By.css('div'));
  });


  describe('touchStart', () => {
    it('should set values', () => {
      const el = document.createElement('div');
      el.style.transform = 'translateX(-10.2%)';
      const touch = new Touch({
        clientX: 10,
        clientY: 20,
        identifier: 1,
        target: el
      });
      const event = new TouchEvent('touchstart', {targetTouches: [touch], touches: [touch]});
      const dir = new SwipableDirective({nativeElement: el});
      dir.touchStart(event);
      expect(dir.N).toEqual(0);
      expect(dir.percentPerPage).toEqual(Infinity);
      expect(dir.startedAtX).toEqual(10);
      expect(dir.startedAtY).toEqual(20);
    });
    it('should not set values', () => {
      const el = document.createElement('div');
      el.style.transform = 'translateX(-10.2%)';
      const event = new TouchEvent('touchstart', {targetTouches: [], touches: []});
      const dir = new SwipableDirective({nativeElement: el});
      const spy = spyOn(dir.active, 'emit');
      dir.touchStart(event);
      expect(dir.startedAtX).toBe(undefined);
      expect(dir.startedAtY).toBe(undefined);
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('touchEnd', () => {
    it('should set values', () => {
      const el = document.createElement('div');
      el.style.transform = 'translateX(-10.2%)';
      const touch = new Touch({
        clientX: 10,
        clientY: 20,
        identifier: 1,
        target: el
      });
      const event = new TouchEvent('touchEnd', {targetTouches: [touch], touches: [touch]});
      const dir = new SwipableDirective({nativeElement: el});
      dir.firstMove = true;
      dir.percentPerPage = 1;
      dir.N = 1;
      dir.startedAtX = 1;
      dir.startedAtY = 1;
      dir.widthPerPage = 1;
      dir.newPercent = 1;
      dir.moved = true;

      dir.touchEnd(event);
      expect(dir.N).toEqual(undefined);
      expect(dir.percentPerPage).toEqual(undefined);
      expect(dir.startedAtX).toEqual(undefined);
      expect(dir.startedAtY).toEqual(undefined);
      expect(dir.firstMove).toEqual(true);
      expect(dir.widthPerPage).toEqual(undefined);
      expect(dir.percentAtStart).toEqual(undefined);
      expect(dir.newPercent).toEqual(undefined);
      expect(dir.moved).toEqual(false);
    });
    it('should return when not moved', () => {
      const el = document.createElement('div');
      el.style.transform = 'translateX(-10.2%)';
      const touch = new Touch({
        clientX: 10,
        clientY: 20,
        identifier: 1,
        target: el
      });
      const event = new TouchEvent('touchend', {targetTouches: [touch], touches: [touch]});
      const dir = new SwipableDirective({nativeElement: el});
      dir.moved = false;
      dir.newPercent = undefined;
      dir.touchEnd(event);
      expect(dir.newPercent).toBe(undefined); // must have returned
    });
    it('should set newPercent', () => {
      const el = document.createElement('div');
      el.style.transform = 'translateX(-10.2%)';
      const touch = new Touch({
        clientX: 10,
        clientY: 20,
        identifier: 1,
        target: el
      });
      const event = new TouchEvent('touchend', {targetTouches: [touch], touches: [touch]});
      const dir = new SwipableDirective({nativeElement: el});
      dir.moved = true;
      dir.newPercent = undefined;
      dir.percentAtStart = 20;
      dir.touchEnd(event);
      expect(dir.newPercent).toBe(dir.percentAtStart);
    });
    it('should snap to ', () => {
      const el = document.createElement('div');
      el.style.transform = 'translateX(-10.2%)';
      const touch = new Touch({
        clientX: 10,
        clientY: 20,
        identifier: 1,
        target: el
      });
      const event = new TouchEvent('touchend', {targetTouches: [touch], touches: [touch]});
      const dir = new SwipableDirective({nativeElement: el});
      dir.moved = true;
      dir.newPercent = 0.5;
      dir.percentAtStart = 0.1;
      dir.percentPerPage = 0.1;
      dir.index = 1;
      dir.touchEnd(event);
      expect(dir.index).toBe(0);
    });
  });

  it('should cancel', () => {
    const el = document.createElement('div');
    el.style.transform = 'translateX(-10.2%)';
    const touch = new Touch({
      clientX: 10,
      clientY: 20,
      identifier: 1,
      target: el
    });
    const event = new TouchEvent('touchstart', {targetTouches: [touch], touches: [touch]});
    const dir = new SwipableDirective({nativeElement: el});
    const spy = spyOn(dir, 'touchEnd');
    // @ts-ignore
    dir.touchCancel('test');
    expect(spy).toHaveBeenCalled();

  });

  describe('touchmove', () => {
    it('should return', () => {
      const el = document.createElement('div');
      el.style.transform = 'translateX(-10.2%)';
      const touch = new Touch({
        clientX: 10,
        clientY: 20,
        identifier: 1,
        target: el
      });
      const event = new TouchEvent('touchmove', {targetTouches: [touch], touches: [touch]});
      const dir = new SwipableDirective({nativeElement: el});
      dir.moved = false;
      dir.startedAtX = undefined;
      dir.touchMove(event);
      expect(dir.moved).toBe(false);
    });
    it('should return no touch', () => {
      const el = document.createElement('div');
      el.style.transform = 'translateX(-10.2%)';
      const event = new TouchEvent('touchmove', {targetTouches: [], touches: []});
      const dir = new SwipableDirective({nativeElement: el});
      dir.moved = false;
      dir.startedAtX = undefined;
      dir.touchMove(event);
      expect(dir.moved).toBe(false);
    });
    it('should execute on firstMove', () => {
      const el = document.createElement('div');
      el.style.transform = 'translateX(-10.2%)';
      const touch = new Touch({
        clientX: 10,
        clientY: 20,
        identifier: 1,
        target: el
      });
      const event = new TouchEvent('touchmove', {targetTouches: [touch], touches: [touch]});
      const dir = new SwipableDirective({nativeElement: el});
      const spy = spyOn(dir.allowScroll, 'emit');
      dir.moved = false;
      dir.firstMove = true;
      dir.startedAtX = 12;
      dir.startedAtY = 20;
      dir.touchMove(event);
      expect(dir.moved).toBe(true);
      expect(dir.firstMove).toBe(false);
      expect(spy).toHaveBeenCalled();
    });
    it('should execute on firstMove and block', () => {
      const el = document.createElement('div');
      el.style.transform = 'translateX(-10.2%)';
      const touch = new Touch({
        clientX: 10,
        clientY: 20,
        identifier: 1,
        target: el
      });
      const event = new TouchEvent('touchmove', {targetTouches: [touch], touches: [touch]});
      const dir = new SwipableDirective({nativeElement: el});
      const spy = spyOn(dir.allowScroll, 'emit');
      dir.moved = false;
      dir.firstMove = true;
      dir.startedAtX = 12;
      dir.startedAtY = 0;
      dir.touchMove(event);
      expect(dir.moved).toBe(true);
      expect(dir.firstMove).toBe(true);
      expect(spy).not.toHaveBeenCalled();
      expect(dir.startedAtX).toBe(undefined);
    });

  });

});
