import { ClosureState } from "../src/closure";
import { describe, expect, test } from "@jest/globals";
import genExpression from "../src/js-lexical";
import Grammar from "../src/javascript-grammar";
import expressionParser from "../src";
const genGrammar = (grammar: [string, string[][]][]) => {
	const map = new Map(grammar);
	return map;
};
const genInitState = (state: any) => {
	return state as ClosureState;
};
describe("test lr analysis third", () => {
	test("if statement", () => {
		const testCase = `
    if (true) {
      let a = 1;
      const b = 2;
    }
    `;
		const list = genExpression(testCase);
		const ast = expressionParser(
			genInitState({
				StatementList: {
					EOF: {
						$finish: true,
					},
				},
			}),
			genGrammar(Grammar),
			list
		);
    console.log(JSON.stringify(ast, null, 2));
  //   expect(ast).toStrictEqual([
	// 	{
	// 		type: "Statement",
	// 		children: [
	// 			{
	// 				type: "IfStatement",
	// 				children: [
	// 					{
	// 						type: "if",
	// 						value: "if",
	// 					},
	// 					{
	// 						type: "(",
	// 						value: "(",
	// 					},
	// 					{
	// 						type: "Expression",
	// 						children: [
	// 							{
	// 								type: "AssignmentExpression",
	// 								children: [
	// 									{
	// 										type: "AdditiveExpression",
	// 										children: [
	// 											{
	// 												type: "MultiplicativeExpression",
	// 												children: [
	// 													{
	// 														type: "LeftHandSideExpression",
	// 														children: [
	// 															{
	// 																type: "MemberExpression",
	// 																children: [
	// 																	{
	// 																		type: "PrimaryExpression",
	// 																		children:
	// 																			[
	// 																				{
	// 																					type: "Literal",
	// 																					children:
	// 																						[
	// 																							{
	// 																								type: "BooleanLiteral",
	// 																								value: "true",
	// 																							},
	// 																						],
	// 																				},
	// 																			],
	// 																	},
	// 																],
	// 															},
	// 														],
	// 													},
	// 												],
	// 											},
	// 										],
	// 									},
	// 								],
	// 							},
	// 						],
	// 					},
	// 					{
	// 						type: ")",
	// 						value: ")",
	// 					},
	// 					{
	// 						type: "Statement",
	// 						children: [
	// 							{
	// 								type: "Declaration",
	// 								children: [
	// 									{
	// 										type: "let",
	// 										value: "let",
	// 									},
	// 									{
	// 										type: "Identifier",
	// 										value: "a",
	// 									},
	// 									{
	// 										type: "=",
	// 										value: "=",
	// 									},
	// 									{
	// 										type: "Expression",
	// 										children: [
	// 											{
	// 												type: "AssignmentExpression",
	// 												children: [
	// 													{
	// 														type: "AdditiveExpression",
	// 														children: [
	// 															{
	// 																type: "MultiplicativeExpression",
	// 																children: [
	// 																	{
	// 																		type: "LeftHandSideExpression",
	// 																		children:
	// 																			[
	// 																				{
	// 																					type: "MemberExpression",
	// 																					children:
	// 																						[
	// 																							{
	// 																								type: "PrimaryExpression",
	// 																								children:
	// 																									[
	// 																										{
	// 																											type: "Literal",
	// 																											children:
	// 																												[
	// 																													{
	// 																														type: "NumericLiteral",
	// 																														value: "1",
	// 																													},
	// 																												],
	// 																										},
	// 																									],
	// 																							},
	// 																						],
	// 																				},
	// 																			],
	// 																	},
	// 																],
	// 															},
	// 														],
	// 													},
	// 												],
	// 											},
	// 										],
	// 									},
	// 									{
	// 										type: ";",
	// 										value: ";",
	// 									},
	// 								],
	// 							},
	// 						],
	// 					},
	// 				],
	// 			},
	// 		],
	// 	},
	// ]);
	});
  test("asi", () => {
		const testCase = `let a = 1 + 2 * 3`;
		const list = genExpression(testCase);
		const ast = expressionParser(
			genInitState({
				StatementList: {
					EOF: {
						$finish: true,
					},
				},
			}),
			genGrammar(Grammar),
			list
		);
    // console.log(JSON.stringify(ast, null, 2));
  })
  test("asi & return", () => {
		const testCase = `const a = 1 + 2 * 3
    const b = 2`;
		const list = genExpression(testCase);
		const ast = expressionParser(
			genInitState({
				StatementList: {
					EOF: {
						$finish: true,
					},
				},
			}),
			genGrammar(Grammar),
			list
		);
		// console.log(JSON.stringify(ast, null, 2));
  });
});
