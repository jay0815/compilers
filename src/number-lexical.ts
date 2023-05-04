import genExpression from './lexical-analyze';

const types = ['Number', 'add', 'minus', 'multiply', 'divide', 'bracketStart', 'bracketEnd'] as const;

export interface Expression {
  value?: string;
  type: string
}

const number = "(0|[1-9][0-9]*(\\.[0-9]?)?|\\.[0-9]+)";
const add = "\\+";
const minus = "\\-";
const multiply = "\\*";
const divide = "\\/";
const bracketStart = "\\(";
const bracketEnd = "\\)";
const lexicalParser = (code: string) => {
    const rule = `(?<Number>${number})|
(?<add>${add})|
(?<minus>${minus})|
(?<multiply>${multiply})|
(?<divide>${divide})|
(?<bracketStart>${bracketStart})|
(?<bracketEnd>${bracketEnd})`;
  return genExpression({
    code,
    types,
    rule,
    format: (v, t) => {
      return {
        value: v,
        type: ['Number'].includes(t) ? t : v
      }
    }
  })
}

export default lexicalParser;