interface Closure {
  $reduce: string; rules: string[]
}

export const compareGetClosure = (nonTerminalSymbol: string, Grammar: Map<string, string[][]>) => {
  const extend = new Set();
  const res = [];
  const stack = [nonTerminalSymbol];

  while (stack.length > 0) {
    // console.log(JSON.stringify(stack))
    const symbol = stack.pop();
    if (typeof symbol !== 'undefined') {
      if (extend.has(symbol)) {
        continue;
      }
      extend.add(symbol);
      const allRules = Grammar.get(symbol) || [];
      for (const rules of allRules) {
        // console.log(rules, 'rules')
        res.push({
          rules, $reduce: symbol
        })
        stack.push(...rules)
      }
    }
  }
  return res;
}

export const getClosure = (nonTerminalSymbol: string, Grammar: Map<string, string[][]>) => {
  const store: Closure[] = [];
  const stack = [nonTerminalSymbol];
  const visited = new Set<string>();
  while (stack.length) {
    const temp: string[] = [];
    while (stack.length) {
      const symbol = stack.pop();
      if (symbol) {
        if (!visited.has(symbol)) {
          const allRules = Grammar.get(symbol);
          if (Array.isArray(allRules)) {
            allRules.forEach((rules) => {
              store.push({ rules, $reduce: symbol });
              temp.push(...rules)
            })
          }
          visited.add(symbol);
        }
      }
    }
    stack.push(...temp)
  }
  return store;
}

const StateRef = new Map<string, ClosureState>();

type EOFState = {
  EOF: {};
}

export type NormalState = {
  [key: string]: NormalState;
} & {
  '$reduce': {
    target: string;
    count: number;
  }
}

export type ClosureState = NormalState | EOFState

const getClosureState = (state: ClosureState, Grammar: Map<string, string[][]>) => {
  StateRef.set(JSON.stringify(state), state);
  for (const property of Object.keys(state)) {
    if (property.startsWith('$')) {
      continue;
    }
    const closures = getClosure(property, Grammar);
    closures.forEach((closure) => {
      const { rules, $reduce } = closure;
      let currentState = state as NormalState;
      rules.forEach((symbol, index) => {
        if (!currentState[symbol]) {
          currentState[symbol] = {} as NormalState;
        }
        currentState = currentState[symbol];
      });
      if (!currentState.$reduce) {
        currentState.$reduce = {
          target: $reduce,
          count: rules.length
        };
      }
    })
  }

  for (const property of Object.keys(state)) {
    if (property.startsWith('$')) {
      continue;
    }
    const key = JSON.stringify((state as NormalState)[property]);
    const currentState = StateRef.get(key)
    if (currentState) {
      (state as NormalState)[property] = currentState as NormalState;
    } else {
      getClosureState((state as NormalState)[property], Grammar)
    }
  }
}

export default getClosureState;