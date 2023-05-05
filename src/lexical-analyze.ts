export interface Expression<T extends  string> {
  value?: string;
  type: 'EOF' | T | string;
}

type GenKeys<T extends readonly string[]> =T[(keyof T) & number];

const genExpression = <T extends readonly string[]>({
  code, rule, types, format = (value, type) => ({ value, type })
} : {
  code: string, rule: string, types: T; 
  format?: (value: string, type: GenKeys<T>) => Required<Expression<GenKeys<T>>>
}) => {
  type Keys = typeof types[(keyof typeof types) & number];
  let searchResult: RegExpExecArray | null;
  const res: Expression<Keys>[] = [];
  const n = types.length;
  const regExp = new RegExp(rule.trim().replaceAll(" ", "").replaceAll("\n", "|"), 'g');
  console.log('regExp', regExp)
  while (searchResult = regExp.exec(code)) {
    const groups = searchResult.groups as Record<Keys, string | undefined>;
    for (let i = 0; i < n; i++) {
      const type = types[i] as Keys;
      const currentValue = groups[type];
      if (typeof currentValue !== 'undefined') {
        res.push(format(currentValue, type));
        break;
      }
    }
  }
  res.push({
    type: 'EOF'
  })
  return res;
}

export default genExpression;