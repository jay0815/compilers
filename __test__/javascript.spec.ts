import { getClosure } from '../src/closure';
import { describe, expect, test } from '@jest/globals';
import genExpression from '../src/lexical';
import expressionParser from '../src';
import Grammar, { initState } from '../src/javascript-grammar';

const beautify = (target: any) => JSON.stringify(target, null, 4);
describe("test lr analysis", () => {
  test("gen closure list by symbol", () => {
    const closure = getClosure('Expression', Grammar)
    expect(beautify(closure)).toBe(beautify(
      [
        // {
        //   rules: ['MultiplicativeExpression'],
        //   $reduce: 'AdditiveExpression'
        // },
        // {
        //   rules: ['AdditiveExpression', '+', 'MultiplicativeExpression'],
        //   $reduce: 'AdditiveExpression'
        // },
        // {
        //   rules: ['AdditiveExpression', '-', 'MultiplicativeExpression'],
        //   $reduce: 'AdditiveExpression'
        // },
        // {
        //   rules: ['PrimaryExpression'],
        //   $reduce: 'MultiplicativeExpression'
        // },
        // {
        //   rules: ['MultiplicativeExpression', '*', 'PrimaryExpression'],
        //   $reduce: 'MultiplicativeExpression'
        // },
        // {
        //   rules: ['MultiplicativeExpression', '/', 'PrimaryExpression'],
        //   $reduce: 'MultiplicativeExpression'
        // },
        // {
        //   rules: ['Number'],
        //   $reduce: 'PrimaryExpression'
        // },
        // {
        //   rules: ['(', 'Expression', ')'],
        //   $reduce: 'PrimaryExpression'
        // },
        // {
        //   rules: ['AdditiveExpression'],
        //   $reduce: 'Expression'
        // },
      ]
    ));
  });

  test('ast length should be 5', () => {
    const testCase = "1*(2+3)";
    const list = genExpression(testCase);
    const ast = expressionParser(initState, Grammar ,list);
    expect(ast.length).toBe(5)
  });
})
