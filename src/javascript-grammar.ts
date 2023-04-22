import type { ClosureState } from "./closure";
export const initState = {
  'Expression': {
    // top level Expression rule
    EOF: Object.create(null)
  }
} as unknown as ClosureState;


const Grammar = new Map(
  [
    ['Literal', [
      ['BooleanLiteral'], 
      ['NullLiteral'],
      ['StringLiteral'],
      ['NumericLiteral'],
      ]
    ],
    [
      'PrimaryExpression', [
        ['Identifier'],
        ['(', 'Expression', ')'],
        ['Literal'],  
      ]
    ],
    ['NewExpression', [
        ['MemberExpression'],
        ['new', 'NewExpression'],
      ]
    ],
    ['NewExpressionWithParameter', [
      ['MemberExpression'],
      ['new', 'NewExpression', '(', ')'],
    ]],
    ['CallExpression', [
      ['NewExpressionWithParameter', "(", ")"],
      ['new', "NewExpressionWithParameter"],
      ['CallExpression', '.', 'Identifier'],
      ['CallExpression', '[', 'Identifier', ']'],
    ]],
    [
      'MemberExpression', [
        ['PrimaryExpression'],
        ['new', 'MemberExpression'],
        ['new', 'MemberExpression', "(", ")"],
        ['MemberExpression', '.', 'Identifier'],
        ['MemberExpression', '[', 'Identifier', ']'],
        ['MemberExpression', "(", ")"],
      ]
    ],
    ['Expression', [
      ['NewExpression'],
    ]]
  ]
);


export default Grammar