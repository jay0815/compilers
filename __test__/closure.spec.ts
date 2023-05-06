import { getClosure, compareGetClosure } from '../src/closure';
import { describe, expect, test } from '@jest/globals';
import Grammar from '../src/javascript-grammar';

describe("test lr analysis", () => {
  test("gen closure list by Literal", () => {
    const closure = getClosure('Literal', Grammar)
    expect(closure).toStrictEqual([
      {
        "rules": [
          "BooleanLiteral"
        ],
        "$reduce": "Literal"
      },
      {
        "rules": [
          "NullLiteral"
        ],
        "$reduce": "Literal"
      },
      {
        "rules": [
          "StringLiteral"
        ],
        "$reduce": "Literal"
      },
      {
        "rules": [
          "NumericLiteral"
        ],
        "$reduce": "Literal"
      }
    ])
  });
  test("gen closure list by Expression", () => {
    const closure = getClosure('Expression', Grammar)
    expect(closure).toStrictEqual( [
      { rules: [ 'NewExpression' ], '$reduce': 'Expression' },
      { rules: [ 'MemberExpression' ], '$reduce': 'NewExpression' },
      { rules: [ 'new', 'NewExpression' ], '$reduce': 'NewExpression' },
      { rules: [ 'PrimaryExpression' ], '$reduce': 'MemberExpression' },
      {
        rules: [ 'new', 'MemberExpression' ],
        '$reduce': 'MemberExpression'
      },
      {
        rules: [ 'new', 'MemberExpression', '(', ')' ],
        '$reduce': 'MemberExpression'
      },
      {
        rules: [ 'MemberExpression', '.', 'Identifier' ],
        '$reduce': 'MemberExpression'
      },
      {
        rules: [ 'MemberExpression', '[', 'Identifier', ']' ],
        '$reduce': 'MemberExpression'
      },
      {
        rules: [ 'MemberExpression', '(', ')' ],
        '$reduce': 'MemberExpression'
      },
      { rules: [ 'Identifier' ], '$reduce': 'PrimaryExpression' },
      { rules: [ '(', 'Expression', ')' ], '$reduce': 'PrimaryExpression' },
      { rules: [ 'Literal' ], '$reduce': 'PrimaryExpression' },
      { rules: [ 'BooleanLiteral' ], '$reduce': 'Literal' },
      { rules: [ 'NullLiteral' ], '$reduce': 'Literal' },
      { rules: [ 'StringLiteral' ], '$reduce': 'Literal' },
      { rules: [ 'NumericLiteral' ], '$reduce': 'Literal' }
    ])
  });

})
