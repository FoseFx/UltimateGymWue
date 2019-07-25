import { cronPattern } from '../src/main';
it('should set cronPattern', () => {
  expect(cronPattern).toBe("*/5 7-20 * * 1-5");
});
