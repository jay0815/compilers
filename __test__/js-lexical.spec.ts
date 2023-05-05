import { describe, expect, test } from '@jest/globals';
import lexicalParser from '../src/javascript-lexical';

describe("test js lexical", () => {
  test('Identifier', () => {
    const list = lexicalParser("a");
    expect(list).toStrictEqual(
      [{ value: 'a', type: 'Identifier' }, { type: 'EOF' }]
    )
  })
  test('NumericLiteral', () => {
    const list = lexicalParser("1");
    expect(list).toStrictEqual(
      [{ value: '1', type: 'NumericLiteral' }, { type: 'EOF' }]
    )
  })
  test('StringLiteral', () => {
    const list = lexicalParser("'1'");
    expect(list).toStrictEqual(
      [{ value: "'1'", type: 'StringLiteral' }, { type: 'EOF' }]
    )
  })
  test('BooleanLiteral', () => {
    const list = lexicalParser("true");
    expect(list).toStrictEqual(
      [{ value: "true", type: 'BooleanLiteral' }, { type: 'EOF' }]
    )
  })
  test('NullLiteral', () => {
    const list = lexicalParser("null");
    expect(list).toStrictEqual(
      [{ value: "null", type: 'NullLiteral' }, { type: 'EOF' }]
    )
  })
  test("analyze calc expression", () => {
    const testCase = "1 *(2+3)";
    const tokens = lexicalParser(testCase);
    expect(tokens).toStrictEqual(
      [
        { type: 'NumericLiteral', value: '1' },
        { type: 'WhiteSpace', value: ' ' },
        { type: '*', value: '*' },
        { type: '(', value: '(' },
        { type: 'NumericLiteral', value: '2' },
        { type: '+', value: '+' },
        { type: 'NumericLiteral', value: '3' },
        { type: ')', value: ")" },
        { type: 'EOF' }
      ]
    );
  });
  test("analyze statement", () => {
    const testCase = "let a = 'cons';";
    const tokens = lexicalParser(testCase);
    expect(tokens).toStrictEqual(
      [
        { type: 'let', value: 'let' },
        { type: 'WhiteSpace', value: ' ' },
        { type: 'Identifier', value: 'a' },
        { type: 'WhiteSpace', value: ' ' },
        { type: '=', value: '=' },
        { type: 'WhiteSpace', value: ' ' },
        { type: 'StringLiteral', value: "'cons'" },
        { type: ';', value: ";" },
        { type: 'EOF' }
      ]
    );
  });
  test("analyze statement - Identifier", () => {
    const testCase = "let a = truefalse;";
    const tokens = lexicalParser(testCase);
    expect(tokens).toStrictEqual(
      [
        { type: 'let', value: 'let' },
        { type: 'WhiteSpace', value: ' ' },
        { type: 'Identifier', value: 'a' },
        { type: 'WhiteSpace', value: ' ' },
        { type: '=', value: '=' },
        { type: 'WhiteSpace', value: ' ' },
        { type: 'Identifier', value: "truefalse" },
        { type: ';', value: ";" },
        { type: 'EOF' }
      ]
    );
  });

  test("analyze statement - BooleanLiteral", () => {
    const testCase = "let a = true;";
    const tokens = lexicalParser(testCase);
    expect(tokens).toStrictEqual(
      [
        { type: 'let', value: 'let' },
        { type: 'WhiteSpace', value: ' ' },
        { type: 'Identifier', value: 'a' },
        { type: 'WhiteSpace', value: ' ' },
        { type: '=', value: '=' },
        { type: 'WhiteSpace', value: ' ' },
        { type: 'BooleanLiteral', value: "true" },
        { type: ';', value: ";" },
        { type: 'EOF' }
      ]
    );
  });

  test("analyze statement - BooleanLiteral", () => {
    const testCase = "if (true) { return false; }";
    const tokens = lexicalParser(testCase);
    expect(tokens).toStrictEqual(
      [
        { type: 'if', value: 'if' },
        { type: 'WhiteSpace', value: ' ' },
        { type: '(', value: '(' },
        { type: 'BooleanLiteral', value: 'true' },
        { type: ')', value: ')' },
        { type: 'WhiteSpace', value: ' ' },
        { type: '{', value: "{" },
        { type: 'WhiteSpace', value: ' ' },
        { type: 'return', value: "return" },
        { type: 'WhiteSpace', value: ' ' },
        { type: 'BooleanLiteral', value: "false" },
        { type: ';', value: ";" },
        { type: 'WhiteSpace', value: " " },
        { type: '}', value: "}" },
        { type: 'EOF' }
      ]
    );
  });
})
