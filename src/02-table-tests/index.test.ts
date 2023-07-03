import { simpleCalculator, Action } from './index';

const testCases = [
  { a: 3, b: 4, action: Action.Add, expected: 7 },
  { a: 10, b: 3, action: Action.Subtract, expected: 7 },
  { a: 7, b: 3, action: Action.Multiply, expected: 21 },
  { a: 18, b: 9, action: Action.Divide, expected: 2 },
  { a: 2, b: 3, action: Action.Exponentiate, expected: 8 },
  { a: 10, b: 2, action: 'JavaScript', expected: null },
  { a: 'one', b: 'two', action: Action.Add, expected: null },
];

describe('simpleCalculator', () => {
  test.each(testCases)(
    'should return the result of the action',
    ({ a, b, action, expected }) => {
      const result = simpleCalculator({ a, b, action });
      expect(result).toBe(expected);
    },
  );
});
