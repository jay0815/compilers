interface Closure {
  $reduce: string; rules: string[]
}

export const getClosure = (nonTerminalSymbol: string, Grammar: Map<string, string[][]>) => {
  const store: Closure[] = [];
  const initSymbols = Grammar.get(nonTerminalSymbol)
  const stack = initSymbols ? [...initSymbols] : [] as string[][];
  const visited = new Set<string>();
  while (stack.length) {
    const temp: string[][] = [];
    while (stack.length) {
      const symbols = stack.pop();
      if (symbols) {
        symbols.forEach((symbol) => {
          if (!visited.has(symbol)) {
            const allRules = Grammar.get(symbol);
            if (Array.isArray(allRules)) {
              store.push(...allRules.map((rules) => ({ rules, $reduce: symbol })));
              temp.push(...allRules)
            }
            visited.add(symbol);
          }
        })
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