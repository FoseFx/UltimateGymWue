import {NotSwipableDirective} from './not-swipable.directive';

describe('NotSwipableDirective', () => {
  it('should create an instance', () => {
    const directive = new NotSwipableDirective();
    expect(directive).toBeTruthy();
  });
  describe('shouldBlock', () => {
    it('should block on sW > oW', () => {
      const directive = new NotSwipableDirective();
      // @ts-ignore
      const t: HTMLElement = {scrollWidth: 6, offsetWidth: 5};
      // @ts-ignore
      const e: Event = {target: t};
      expect(directive.shouldBlock(e)).toEqual(true);
    });
    it('should not block on sW < oW', () => {
      const directive = new NotSwipableDirective();
      // @ts-ignore
      const t: HTMLElement = {scrollWidth: 4, offsetWidth: 5};
      // @ts-ignore
      const e: Event = {target: t};
      expect(directive.shouldBlock(e)).toEqual(false);
    });
    it('should not block on sW = oW', () => {
      const directive = new NotSwipableDirective();
      // @ts-ignore
      const t: HTMLElement = {scrollWidth: 5, offsetWidth: 5};
      // @ts-ignore
      const e: Event = {target: t};
      expect(directive.shouldBlock(e)).toEqual(false);
    });
  });

  describe('touchstart', () => {
    it('should stop Prop on shouldBlock', () => {
      const directive = new NotSwipableDirective();
      spyOn(directive, 'shouldBlock').and.returnValue(true);
      const obj = {stopPropagation: () => {}};
      const spy = spyOn(obj, 'stopPropagation');
      directive.func(obj);
      expect(spy).toHaveBeenCalled();
    });
    it('should stop Prop on shouldBlock', () => {
      const directive = new NotSwipableDirective();
      spyOn(directive, 'shouldBlock').and.returnValue(false);
      const obj = {stopPropagation: () => {}};
      const spy = spyOn(obj, 'stopPropagation');
      directive.func(obj);
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('touchmove', () => {
    it('should stop Prop on shouldBlock', () => {
      const directive = new NotSwipableDirective();
      spyOn(directive, 'shouldBlock').and.returnValue(true);
      const obj = {stopPropagation: () => {}};
      const spy = spyOn(obj, 'stopPropagation');
      directive.func2(obj);
      expect(spy).toHaveBeenCalled();
    });
    it('should stop Prop on shouldBlock', () => {
      const directive = new NotSwipableDirective();
      spyOn(directive, 'shouldBlock').and.returnValue(false);
      const obj = {stopPropagation: () => {}};
      const spy = spyOn(obj, 'stopPropagation');
      directive.func2(obj);
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('touchend', () => {
    it('should stop Prop on shouldBlock', () => {
      const directive = new NotSwipableDirective();
      spyOn(directive, 'shouldBlock').and.returnValue(true);
      const obj = {stopPropagation: () => {}};
      const spy = spyOn(obj, 'stopPropagation');
      directive.func3(obj);
      expect(spy).toHaveBeenCalled();
    });
    it('should stop Prop on shouldBlock', () => {
      const directive = new NotSwipableDirective();
      spyOn(directive, 'shouldBlock').and.returnValue(false);
      const obj = {stopPropagation: () => {}};
      const spy = spyOn(obj, 'stopPropagation');
      directive.func3(obj);
      expect(spy).not.toHaveBeenCalled();
    });
  });

});
