const types = ['Number', 'add', 'minus', 'multiply', 'divide', 'bracketStart', 'bracketEnd'] as const;
const reg = /(?<Number>(0|[1-9][0-9]*)(\.[0-9]?)?|\.[0-9]+)|(?<add>\+)|(?<minus>\-)|(?<multiply>\*)|(?<divide>\/)|(?<bracketStart>\()|(?<bracketEnd>\))/g

export interface Expression {
  value?: string;
  type: string
}

const genExpression = (code: string) => {
  let currentRegExpRes: RegExpExecArray | null;
  const res: Expression[] = [];
  const n = types.length;
  while (currentRegExpRes = reg.exec(code)) {
    if (currentRegExpRes && currentRegExpRes.groups) {
      for (let i = 0; i < n; i++) {
        const groups = currentRegExpRes.groups as Record<string, 'Number' | '+' | '-' | '*' | '/' | '(' | ')' | 'EOF'>;
        if (typeof groups[types[i]] !== 'undefined') {
          res.push({
            type: types[i] === 'Number' ? 'Number' : groups[types[i]],
            value: groups[types[i]],
          });
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