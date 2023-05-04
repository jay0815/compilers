import { describe, expect, test } from '@jest/globals';
import genExpression from '../src/js-lexical';

describe("test js lexical", () => {
  test("analyze calc expression", () => {
    const testCase = "1 *(2+3)";
    const tokens = genExpression(testCase);
    expect(tokens).toStrictEqual(
      [
        { type: 'NumericLiteral', value: '1' },
        { type: 'WhiteSpace', value: ' ' },
        { type: 'Punctuator', value: '*' },
        { type: 'Punctuator', value: '(' },
        { type: 'NumericLiteral', value: '2' },
        { type: 'Punctuator', value: '+' },
        { type: 'NumericLiteral', value: '3' },
        { type: 'Punctuator', value: ")" },
        { type: 'EOF' }
      ]
    );
  });
  test("analyze statement", () => {
    const testCase = "let a = 'cons';";
    const tokens = genExpression(testCase);
    expect(tokens).toStrictEqual(
      [
        { type: 'Identifier', value: 'let' },
        { type: 'WhiteSpace', value: ' ' },
        { type: 'Identifier', value: 'a' },
        { type: 'WhiteSpace', value: ' ' },
        { type: 'Punctuator', value: '=' },
        { type: 'WhiteSpace', value: ' ' },
        { type: 'StringLiteral', value: "'cons'" },
        { type: 'Punctuator', value: ";" },
        { type: 'EOF' }
      ]
    );
  });

})
