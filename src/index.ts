import getClosureState, { ClosureState, NormalState } from "./closure";
import { Expression } from "./lexical";

type Token = Expression | {
  type: string;
  children: Token[];
}

const expressionParser = (initState: ClosureState, Grammar: Map<string, string[][]>, list: Expression[]) => {
  const state = initState;

  const tokens: Token[] = [];
  const states = [initState];
  getClosureState(state, Grammar);
  const n = list.length;

  const getCurrentState = () => {
    const last = states.length - 1;
    return states[last] as NormalState;
  }

  const shift = (token: Expression) => {
    let currentState = getCurrentState();
    // EOF 作为输入符号，用于表示输入结束
    // 在 shift 中做处理 
    // 因为 EOF 不满足任何产生式规则，所以会一直 reduce 至 Expression
    while (!currentState[token.type]) {
      reduce()
      currentState = getCurrentState();
    }
    // 将当前输入符号压入栈中，并转移到下一个状态
    tokens.push(token);
    const nextState = currentState[token.type];
    states.push(nextState);
  };

  const reduce = () => {
    // 将栈顶的若干个符号弹出，这些符号构成一个产生式的右侧部分。
    const currentState = getCurrentState();
    if (currentState) {
      const { target, count } = currentState.$reduce;
      const currentToken: Token = {
        type: target,
        children: []
      }
      for(let i = 0; i < count; i++) {
        states.pop();
        const token = tokens.pop();
        if (token) {
          currentToken.children.unshift(token);
        }
      }
      shift(currentToken);
    } else {
      throw Error('syntax error');
    }
  };
  for (let i = 0; i < n; i++) {
    const token = list[i];
    shift(token);
  }

  return tokens;
}

export default expressionParser;