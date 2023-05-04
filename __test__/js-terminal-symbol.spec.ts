import { describe, expect, test } from '@jest/globals';
import { Keywords, Identifier, NumericLiteral, StringLiteral, BooleanLiteral, NullLiteral, Punctuator } from '../src/javascript-lexical';

const genRegexp = (rule: string) => new RegExp(rule, 'g');
describe("terminal symbol analysis", () => {
  describe("string literal", () => {
    test('letter with single Quote', () => {
      const regExp = genRegexp(StringLiteral);
      expect(regExp.test(`'a'`)).toBe(true);
    })
    test('letter with double Quote', () => {
      const regExp = genRegexp(StringLiteral);
      expect(regExp.test(`"a"`)).toBe(true);
    })
    test('letter without Quote', () => {
      const regExp = genRegexp(StringLiteral);
      expect(regExp.test('a')).toBe(false);
    })
  });
  describe("number literal", () => {
    test('number with single Quote', () => {
      const regExp = genRegexp(NumericLiteral);
      expect(regExp.test(`'1'`)).toBe(false);
    })
    test('number without Quote', () => {
      const regExp = genRegexp(NumericLiteral);
      expect(regExp.test(`.a`)).toBe(false);
    })
    test('number with double Quote', () => {
      const regExp = genRegexp(NumericLiteral);
      expect(regExp.test(`"1"`)).toBe(false);
    })
    test('number without Quote & unexpected letter', () => {
      const regExp = genRegexp(NumericLiteral);
      expect(regExp.test(`1.a`)).toBe(false);
    })
    test('number without Quote', () => {
      const regExp = genRegexp(NumericLiteral);
      expect(regExp.test(`1`)).toBe(true);
    })
    test('number without Quote & unexpected letter', () => {
      const regExp = genRegexp(NumericLiteral);
      expect(regExp.test(`1a`)).toBe(false);
    })
    test('decimal', () => {
      const regExp = genRegexp(NumericLiteral);
      expect(regExp.test(`1.2345`)).toBe(true);
    })
    test('decimal with none singed ExponentPart', () => {
      const regExp = genRegexp(NumericLiteral);
      expect(regExp.test('1.e10')).toBe(true);
    })
    test('decimal with positive ExponentPart', () => {
      const regExp = genRegexp(NumericLiteral);
      expect(regExp.test('1.e+10')).toBe(true);
    })
    test('decimal with negative ExponentPart', () => {
      const regExp = genRegexp(NumericLiteral);
      expect(regExp.test('1.e-10')).toBe(true);
    })
    test('Octal', () => {
      const regExp = genRegexp(NumericLiteral);
      expect(regExp.test('0o7')).toBe(true);
    })
    test('Octal & unexpected letter', () => {
      const regExp = genRegexp(NumericLiteral);
      expect(regExp.test('0o7a')).toBe(false);
    })
  });

  describe("boolean literal", () => {
    test("true", () => {
      const regExp = genRegexp(BooleanLiteral);
      expect(regExp.test("true")).toBe(true);
    });
    test("false", () => {
      const regExp = genRegexp(BooleanLiteral);

      expect(regExp.test("false")).toBe(true);
    });
    test("prefix with false", () => {
      const regExp = genRegexp(BooleanLiteral);
      console.log(regExp)
      expect(regExp.test("falsetrue")).toBe(false);
    });
    test("prefix with true", () => {
      const regExp = genRegexp(BooleanLiteral);

      expect(regExp.test("truefalse")).toBe(false);
    });
  })

  describe("null literal", () => {
    const regExp = genRegexp(NullLiteral);
    test("null", () => {
      expect(regExp.test("null")).toBe(true);
    });
    test("prefix with null", () => {
      expect(regExp.test("nullii")).toBe(false);
    });
    test("suffix with null", () => {
      expect(regExp.test("iinull")).toBe(false);
    });
  })
  describe("keywords", () => {
    const regExp = genRegexp(Keywords);
    test("new", () => {
      expect(regExp.test("new")).toBe(true);
    });
    test("const", () => {
      expect(regExp.test("const")).toBe(true);
    });
    test("constc", () => {
      expect(regExp.test("constc")).toBe(false);
    });
  })

  describe("Identifier", () => {
    // [a-zA-Z_$][a-zA-Z0-9_$\\u200C\\u200D]*
    const regExp = genRegexp(Identifier);
    test("start with a", () => {
      expect(regExp.test("aCG")).toBe(true);
    })
    test("start with A", () => {
      expect(regExp.test("aCG")).toBe(true);
    })
    test("start with _", () => {
      expect(regExp.test("_CG")).toBe(true);
    })
    test("start with $", () => {
      expect(regExp.test("$CG")).toBe(true);
    })
    test("start with @", () => {
      expect(regExp.test("@CG")).toBe(false);
    })
  })
})