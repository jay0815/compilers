const Grammar = new Map(
  [
    [
      'Expression', [['AdditiveExpression']]
    ],
    [
      'AdditiveExpression', [
        ['MultiplicativeExpression'],
        ['AdditiveExpression', '+', 'MultiplicativeExpression'],
        ['AdditiveExpression', '-', 'MultiplicativeExpression']
      ]
    ],
    ['MultiplicativeExpression', [
      ['PrimaryExpression'],
      ['MultiplicativeExpression', '*', 'PrimaryExpression'],
      ['MultiplicativeExpression', '/', 'PrimaryExpression'],
    ]],
    ['PrimaryExpression', [
      ['Number'],
      ['(', 'Expression', ')'],
    ]],
  ]
);

export const getClosureList = (symbol: string) => {
  const store: string[][] = [];
  const initQueue = Grammar.get(symbol);
  if (initQueue) {
    const visited = new Set();
    const queue = [...initQueue];
    while(queue.length) {
      const current = queue.pop();
      if (current) {
        current.forEach((key) => {
          const rules = Grammar.get(key);
          if (rules && !visited.has(rules)) {
            rules.forEach((rule) => {
                store.push(rule);
            })
            queue.push(...rules)
            visited.add(rules);
          }
        })
      }
    }
  }
  return store;
}

export const getClosure = (symbol: string) => {
  const store: string[][] = [];
  const initQueue = Grammar.get(symbol);
  if (initQueue) {
    const visited = new Set();
    const queue = [...initQueue];
    while(queue.length) {
      const current = queue.pop();
      if (current) {
        current.forEach((key) => {
          const rules = Grammar.get(key);
          if (rules && !visited.has(rules)) {
            rules.forEach((rule) => {
                store.push(rule);
            })
            queue.push(...rules)
            visited.add(rules);
          }
        })
      }
    }
  }
  return store;
}

/**
 * 
 * <Number> "+"
 * Number 先移入
 * 检查 "+", 不能移入, 进行归约, Number -> PrimaryExpression
 * 
 * 归于 至 无法规约时，还是无法移入，throw unexpected token
 * 
 * 当最终 不为 EOF, throw unexpected end
 */

interface States {
  [key: string]: {
    $reduce?: string;
  } & States
}

// const states = {
//   Expression: {
//     $reduce: 'AdditiveExpression',
//   },
//   PrimaryExpression: {
//     $reduce: 'MultiplicativeExpression',
//   },
//   Number: {
//     $reduce: "PrimaryExpression"
//   },
//   "(": {
//     Expression: {
//       $reduce: ")"
//     }
//   },
//   MultiplicativeExpression: {
//     $reduce: 'AdditiveExpression',
//     '*': {
//       PrimaryExpression: {
//         $reduce: 'MultiplicativeExpression'
//       }
//     },
//     '/': {
//       PrimaryExpression: {
//         $reduce: 'MultiplicativeExpression'
//       }
//     },
//   },
//   AdditiveExpression: {
//     '+': {
//       MultiplicativeExpression: {
//         $reduce: 'AdditiveExpression',
//       },
//     },
//     '-': {
//       MultiplicativeExpression: {
//         $reduce: 'AdditiveExpression',
//       },
//     },
//     $reduce: 'Expression'
//   },
// };

const initState = {
  'Expression': {
    $reduce: 'AdditiveExpression'
  }
}

// const getClosureStates = (state) => {
//   const property = Object.keys(state)[0];
//   const closure = getClosure(property);
//   // console.log('getClosureStates', closure)
//   // closure.forEach(({ value, rules }) => {

//   // })
//   // for (let property of Object.keys(state)) {
//   //   const closure = getClosure(property);

//   // }
//   // for (let property of Object.keys(state)) {
//   //   if (property.startsWith('$')) {
//   //     continue;
//   //   }
//   //   getClosureStates(state[property])

//   // }
// }

// getClosureStates(initState)