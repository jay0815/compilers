import { getClosureList } from '../src/index';
import { describe, expect, test } from '@jest/globals';

const beautify = (target: any) => JSON.stringify(target, null, 4);
describe("test lr analysis", () => {
  test("gen closure list by symbol", () => {
    const closure = getClosureList('Expression')
    expect(beautify(closure)).toBe(beautify(
      [
        ['MultiplicativeExpression'],
        ['AdditiveExpression', '+', 'MultiplicativeExpression'],
        ['AdditiveExpression', '-', 'MultiplicativeExpression'],
        ['PrimaryExpression'],
        ['MultiplicativeExpression', '*', 'PrimaryExpression'],
        ['MultiplicativeExpression', '/', 'PrimaryExpression'],
        ['Number'],
        ['(', 'Expression', ')'],
        ['AdditiveExpression']
      ]
    ));
  });
})
