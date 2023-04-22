import type { ClosureState } from "./closure";
export const initState = {
  'Expression': {
    // top level Expression rule
    EOF: Object.create(null)
  }
} as unknown as ClosureState;


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


export default Grammar