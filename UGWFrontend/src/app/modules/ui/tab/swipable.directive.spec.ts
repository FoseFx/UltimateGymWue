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

  });

});
