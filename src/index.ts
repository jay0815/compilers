import getClosureState, { ClosureState, NormalState } from "./closure";
import { Expression } from "./lexical";

export const initState = {
  'Expression': {
    // top level Expression rule
    EOF: Object.create(null)
  }
} as unknown as ClosureState;

type Token = Expression | {
  type: string;
  children: Token[];
}

const expressionParser = (list: Expression[]) => {
  const state = initState;

  const tokens: Token[] = [];
  const states = [initState];
  getClosureState(state);
  const n = list.length;

  const getCurrentState = () => {
    const last = states.length - 1;
    return states[last] as NormalState;
  }

  const shift = (token: Expression) => {
    let currentState = getCurrentState();
    while (!currentState[token.type]) {
      reduce()
      currentState = getCurrentState();
    }
    // 将当前输入符号压入栈中，并将状态转移到下一个状态
    tokens.push(token);
    const nextState = currentState[token.type];
    states.push(nextState);
  };

  const reduce = () => {
    // 将栈顶的若干个符号弹出，这些符号构成一个产生式的右侧部分。然后将左侧的非终结符压入栈中，并根据goto函数转移到新的状态
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
    if (token.type === 'EOF') {
      if (i === n - 1) {
        break;
      } else {
        throw Error('throw unexpected end');
      }
    }
    shift(token);
  }

  return tokens;
}

export default expressionParser;