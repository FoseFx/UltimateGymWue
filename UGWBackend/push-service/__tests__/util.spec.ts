import { isJestTest } from '../src/util';

describe("isTest", () => {
  it('should return false, when no "jest" was found in args', () => {
    expect(isJestTest(["/path/to/node", "/path/to/main.js"])).toBe(false);
    expect(isJestTest(["node", "main.js"])).toBe(false);
  });
  it('should return true, when "jest" was found in args', () => {
    expect(isJestTest(["/path/to/node", "path/to/jest", "/path/to/main.js"])).toBe(true);
    expect(isJestTest(["node", "jest", "main.js"])).toBe(true);
  });
});
