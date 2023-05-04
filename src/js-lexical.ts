const TokenRegex = `
(?<WhiteSpace>[\\t\\v\\f\\u0020\\u00A0\\u1680\\u180E\\u2000-\\u200A\\u202F\\u205f\\u3000\\uFEFF])
(?<NumericLiteral>(?:0[xX][0-9a-fA-F]*|\\.[0-9]+|(?:[1-9]+[0-9]*|0)(?:\\.[0-9]*|\\.)?)(?:[eE][+-]{0,1}[0-9]+)?(?![_$a-zA-Z0-9]))
(?<Keyword>break(?![_$a-zA-Z0-9])|else(?![_$a-zA-Z0-9])|new(?![_$a-zA-Z0-9])|var(?![_$a-zA-Z0-9])|case(?![_$a-zA-Z0-9])|finally(?![_$a-zA-Z0-9])|return(?![_$a-zA-Z0-9])|void(?![_$a-zA-Z0-9])|catch(?![_$a-zA-Z0-9])|for(?![_$a-zA-Z0-9])|switch(?![_$a-zA-Z0-9])|while(?![_$a-zA-Z0-9])|continue(?![_$a-zA-Z0-9])|function(?![_$a-zA-Z0-9])|this(?![_$a-zA-Z0-9])|with(?![_$a-zA-Z0-9])|default(?![_$a-zA-Z0-9])|if(?![_$a-zA-Z0-9])|throw(?![_$a-zA-Z0-9])|delete(?![_$a-zA-Z0-9])|in(?![_$a-zA-Z0-9])|try(?![_$a-zA-Z0-9])|do(?![_$a-zA-Z0-9])|instanceof(?![_$a-zA-Z0-9])|typeof(?![_$a-zA-Z0-9]))
(?<NullLiteral>null(?![_$a-zA-Z0-9]))
(?<BooleanLiteral>(?:true|false)(?![_$a-zA-Z0-9]))
(?<Punctuator>>>>>=|>>=|<<=|===|!==|>>>|<<|%=|\-=|\\+=|\\*|\\*=|\\\||\\^|\!|\~|\\+|\-|\/|\\(|\\)|\{|\}|\[|\]|\>|\<|\=|\!|\&|\\|\%|\~|\:|\,|\;|\\?)
(?<StringLiteral>"(?:[^"\\\\n\\\\\\r\\u2028\\u2029]|\\\\(?:['"\\\\bfnrtv\\n\\r\\u2028\\u2029]|\\r\\n)|\\\\x[0-9a-fA-F]{2}|\\\\u[0-9a-fA-F]{4}|\\\\[^0-9ux'"\\\\bfnrtv\\n\\\\\\r\\u2028\\u2029])*"|'(?:[^'\\n\\\\\\r\\u2028\\u2029]|\\\\(?:['"\\\\bfnrtv\\n\\r\\u2028\\u2029]|\\r\\n)|\\\\x[0-9a-fA-F]{2}|\\\\u[0-9a-fA-F]{4}|\\\\[^0-9ux'"\\\\bfnrtv\\n\\\\\\r\\u2028\\u2029])*')
(?<Identifier>[_$a-zA-Z][_$a-zA-Z0-9]*)
`

const types = ['WhiteSpace', 'NumericLiteral', 'Keyword', 'NullLiteral', 'BooleanLiteral', 'StringLiteral', 'Punctuator', 'Identifier'] as const;
type Types = (typeof types)[number];

export interface Expression {
  value?: string;
  type: string
}

const helper = (type: Types, value: string) => {
  if (['Punctuator', 'Keyword'].includes(type)) {
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

const genExpression = (code: string) => {
  let currentRegExpRes: RegExpExecArray | null;
  const res: Expression[] = [];
  const n = types.length;
  const reg = new RegExp(TokenRegex.trim().replaceAll(" ", "").replaceAll("\n", "|"), 'g');
  
  while (currentRegExpRes = reg.exec(code)) {
    if (currentRegExpRes && currentRegExpRes.groups) {
      for (let i = 0; i < n; i++) {
        const groups = currentRegExpRes.groups as Record<Types, string | undefined>;
        const value = groups[types[i]];
        if (typeof value !== 'undefined') {
          res.push(
            helper(types[i], value)
          )
          break;
        }
      }
    }
  }
  res.push({
    type: 'EOF'
  })
  return res;
}

export default genExpression;