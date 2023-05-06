import genExpression from './lexical-analyze';

export const WhiteSpace = "[\\t\\v\\f\\u0020\\u00A0\\u1680\\u180E\\u2000-\\u200A\\u202F\\u205f\\u3000\\uFEFF]";
export const Keywords = "break(?![_$a-zA-Z0-9])|else(?![_$a-zA-Z0-9])|new(?![_$a-zA-Z0-9])|var(?![_$a-zA-Z0-9])|case(?![_$a-zA-Z0-9])|finally(?![_$a-zA-Z0-9])|return(?![_$a-zA-Z0-9])|void(?![_$a-zA-Z0-9])|catch(?![_$a-zA-Z0-9])|for(?![_$a-zA-Z0-9])|switch(?![_$a-zA-Z0-9])|while(?![_$a-zA-Z0-9])|continue(?![_$a-zA-Z0-9])|function(?![_$a-zA-Z0-9])|this(?![_$a-zA-Z0-9])|with(?![_$a-zA-Z0-9])|default(?![_$a-zA-Z0-9])|if(?![_$a-zA-Z0-9])|throw(?![_$a-zA-Z0-9])|delete(?![_$a-zA-Z0-9])|in(?![_$a-zA-Z0-9])|try(?![_$a-zA-Z0-9])|do(?![_$a-zA-Z0-9])|instanceof(?![_$a-zA-Z0-9])|typeof(?![_$a-zA-Z0-9])";

const BinaryIntegerLiteral = "?:0[Bb][01]+";
const OctalIntegerLiteral = "?:0[Oo][0-7]+";
const HexIntegerLiteral = "?:0[Xx][0-9a-fA-F]+";
const IntegerLiteral = "?:[1-9]+[0-9]*|0(?:\\.[0-9]*|\\.)?(?:[eE][+-]{0,1}[0-9]+)?(?![_$a-zA-Z0-9])";

export const NumericLiteral = `(${BinaryIntegerLiteral})|(${OctalIntegerLiteral})|(${HexIntegerLiteral})|(${IntegerLiteral})`;

export const BooleanLiteral = "?:true|false)(?![_$a-zA-Z0-9])";

export const NullLiteral = "null(?![_$a-zA-Z0-9])";

export const Identifier = "?:[a-zA-Z_$][a-zA-Z0-9_$\\u200C\\u200D]*";

const singleQuote = `'`;
const doubleQuote = `"`;
const genStringLiteral = (symbol: string) => `"(?:[^"\\\\n\\\\\\r\\u2028\\u2029]|\\\\(?:['"\\\\bfnrtv\\n\\r\\u2028\\u2029]|\\r\\n)|\\\\x[0-9a-fA-F]{2}|\\\\u[0-9a-fA-F]{4}|\\\\[^0-9ux'"\\\\bfnrtv\\n\\\\\\r\\u2028\\u2029])*$`;
export const StringLiteral = `${genStringLiteral(doubleQuote)}|${genStringLiteral(singleQuote)}`;

export const Punctuator = ">>>=|>>=|<<=|===|!==|>>>|<<|%=|\-=|\\+=|\\*|\\*=|\\\||\\^|\!|\~|\\+|\-|\/|\\(|\\)|\{|\}|\[|\]|\>|\<|\=|\!|\&|\\|\%|\~|\:|\,|\;|\\?|\\.";

const TokenRegex = `
(?<WhiteSpace>${WhiteSpace})
(?<NumericLiteral>(${BinaryIntegerLiteral})|(${OctalIntegerLiteral})|(${HexIntegerLiteral})|(${IntegerLiteral}))
(?<Keyword>${Keywords})
(?<NullLiteral>${NullLiteral})
(?<BooleanLiteral>(${BooleanLiteral})
(?<Punctuator>${Punctuator})
(?<StringLiteral>"(?:[^"\\\\n\\\\\\r\\u2028\\u2029]|\\\\(?:['"\\\\bfnrtv\\n\\r\\u2028\\u2029]|\\r\\n)|\\\\x[0-9a-fA-F]{2}|\\\\u[0-9a-fA-F]{4}|\\\\[^0-9ux'"\\\\bfnrtv\\n\\\\\\r\\u2028\\u2029])*"|'(?:[^'\\n\\\\\\r\\u2028\\u2029]|\\\\(?:['"\\\\bfnrtv\\n\\r\\u2028\\u2029]|\\r\\n)|\\\\x[0-9a-fA-F]{2}|\\\\u[0-9a-fA-F]{4}|\\\\[^0-9ux'"\\\\bfnrtv\\n\\\\\\r\\u2028\\u2029])*')
(?<Identifier>(${Identifier}))
`

const types = ['WhiteSpace', 'NumericLiteral', 'Keyword', 'NullLiteral', 'BooleanLiteral', 'StringLiteral', 'Punctuator', 'Identifier'] as const;
type Types = (typeof types)[number];

export interface Expression {
  value?: string;
  type: string
}

export const helper = (value: string, type: Types) => {
  if (type === 'WhiteSpace') {
    return null;
  } else if (['Punctuator', 'Keyword'].includes(type)) {
    return {
      type: value,
      value
    }
  } else {
    return {
      type,
      value
    }
  }
}

const lexicalParser = (code: string) => {
  return genExpression({
    code,
    types,
    rule: TokenRegex,
    format: helper
  })
}

export default lexicalParser;