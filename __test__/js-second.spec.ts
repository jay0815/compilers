import { ClosureState } from "../src/closure";
import { describe, expect, test } from "@jest/globals";
import genExpression from "../src/js-lexical";
import expressionParser from "../src";
const genGrammar = (grammar: [string, string[][]][]) => {
	const map = new Map(grammar);
	return map;
};
const genInitState = (state: any) => {
	return state as ClosureState;
};
describe("test lr analysis", () => {
	test("simple assignment", () => {
		const testCase = "a = 1";
		const list = genExpression(testCase);
		const ast = expressionParser(
			genInitState({
				Expression: {
					EOF: {
						$finish: true,
					},
				},
			}),
			genGrammar([
				[
					"Literal",
					[
						["BooleanLiteral"],
						["NullLiteral"],
						["StringLiteral"],
						["NumericLiteral"],
					],
				],
				[
					"PrimaryExpression",
					[["(", "Expression", ")"], ["Identifier"], ["Literal"]],
				],
				[
					"MemberExpression",
					[
						["PrimaryExpression"],
						["new", "MemberExpression"],
						["new", "MemberExpression", "(", ")"],
						["MemberExpression", ".", "Identifier"],
						["MemberExpression", "[", "Identifier", "]"],
						["MemberExpression", "(", ")"],
					],
				],
				[
					"MultiplicativeExpression",
					[
						["LeftHandSideExpression"],
						[
							"MultiplicativeExpression",
							"*",
							"LeftHandSideExpression",
						],
						[
							"MultiplicativeExpression",
							"/",
							"LeftHandSideExpression",
						],
						[
							"MultiplicativeExpression",
							"%",
							"LeftHandSideExpression",
						],
					],
				],
				[
					"AdditiveExpression",
					[
						["MultiplicativeExpression"],
						["AdditiveExpression", "+", "MultiplicativeExpression"],
						["AdditiveExpression", "-", "MultiplicativeExpression"],
					],
				],
				["LeftHandSideExpression", [["MemberExpression"]]],
				[
					"AssignmentExpression",
					[
						["AdditiveExpression"],
						["LeftHandSideExpression", "=", "AssignmentExpression"],
						[
							"LeftHandSideExpression",
							"+=",
							"AssignmentExpression",
						],
						[
							"LeftHandSideExpression",
							"-=",
							"AssignmentExpression",
						],
						[
							"LeftHandSideExpression",
							"*=",
							"AssignmentExpression",
						],
						[
							"LeftHandSideExpression",
							"/=",
							"AssignmentExpression",
						],
					],
				],
				[
					"Expression",
					[
						["AssignmentExpression"],
						["Expression", ",", "AssignmentExpression"],
					],
				],
			]),
			list
		);
		expect(ast).toStrictEqual([
			{
				type: "Expression",
				children: [
					{
						type: "AssignmentExpression",
						children: [
							{
								type: "LeftHandSideExpression",
								children: [
									{
										type: "MemberExpression",
										children: [
											{
												type: "PrimaryExpression",
												children: [
													{
														type: "Identifier",
														value: "a",
													},
												],
											},
										],
									},
								],
							},
							{
								type: "=",
								value: "=",
							},
							{
								type: "AssignmentExpression",
								children: [
									{
										type: "AdditiveExpression",
										children: [
											{
												type: "MultiplicativeExpression",
												children: [
													{
														type: "LeftHandSideExpression",
														children: [
															{
																type: "MemberExpression",
																children: [
																	{
																		type: "PrimaryExpression",
																		children:
																			[
																				{
																					type: "Literal",
																					children:
																						[
																							{
																								type: "NumericLiteral",
																								value: "1",
																							},
																						],
																				},
																			],
																	},
																],
															},
														],
													},
												],
											},
										],
									},
								],
							},
						],
					},
				],
			},
		]);
	});
	test("assignment Class instance", () => {
		const testCase = "c = new A()";
		const list = genExpression(testCase);
		const ast = expressionParser(
			genInitState({
				Expression: {
					EOF: {
						$finish: true,
					},
				},
			}),
			genGrammar([
				[
					"Literal",
					[
						["BooleanLiteral"],
						["NullLiteral"],
						["StringLiteral"],
						["NumericLiteral"],
					],
				],
				[
					"PrimaryExpression",
					[["(", "Expression", ")"], ["Identifier"], ["Literal"]],
				],
				[
					"MemberExpression",
					[
						["PrimaryExpression"],
						["new", "MemberExpression"],
						["new", "MemberExpression", "(", ")"],
						["MemberExpression", ".", "Identifier"],
						["MemberExpression", "[", "Identifier", "]"],
						["MemberExpression", "(", ")"],
					],
				],
				[
					"MultiplicativeExpression",
					[
						["LeftHandSideExpression"],
						[
							"MultiplicativeExpression",
							"*",
							"LeftHandSideExpression",
						],
						[
							"MultiplicativeExpression",
							"/",
							"LeftHandSideExpression",
						],
						[
							"MultiplicativeExpression",
							"%",
							"LeftHandSideExpression",
						],
					],
				],
				[
					"AdditiveExpression",
					[
						["MultiplicativeExpression"],
						["AdditiveExpression", "+", "MultiplicativeExpression"],
						["AdditiveExpression", "-", "MultiplicativeExpression"],
					],
				],
				["LeftHandSideExpression", [["MemberExpression"]]],
				[
					"AssignmentExpression",
					[
						["AdditiveExpression"],
						["LeftHandSideExpression", "=", "AssignmentExpression"],
						[
							"LeftHandSideExpression",
							"+=",
							"AssignmentExpression",
						],
						[
							"LeftHandSideExpression",
							"-=",
							"AssignmentExpression",
						],
						[
							"LeftHandSideExpression",
							"*=",
							"AssignmentExpression",
						],
						[
							"LeftHandSideExpression",
							"/=",
							"AssignmentExpression",
						],
					],
				],
				[
					"Expression",
					[
						["AssignmentExpression"],
						["Expression", ",", "AssignmentExpression"],
					],
				],
				// [
				// 	"FunctionExpression",
				// 	[
				// 		[
				// 			"function",
				// 			"(",
				// 			"FormalParameters",
				// 			")",
				// 			"{",
				// 			"FunctionBody",
				// 			"}",
				// 		],
				// 	],
				// ],
				// [
				// 	"FunctionBody",
				// 	[["function", "(", ")", "{", "StatementList", "}"]],
				// ],
				// ["Statement", [["ExpressionStatement"], ["IfStatement"]]],
				// ["ExpressionStatement", [["Expression"]]],
				// [
				// 	"IfStatement",
				// 	[
				// 		[
				// 			"if",
				// 			"(",
				// 			"Expression",
				// 			")",
				// 			"Statement",
				// 			"else",
				// 			"Statement",
				// 		],
				// 	],
				// ],
			]),
			list
		);
		expect(ast).toStrictEqual([
			{
				type: "Expression",
				children: [
					{
						type: "AssignmentExpression",
						children: [
							{
								type: "LeftHandSideExpression",
								children: [
									{
										type: "MemberExpression",
										children: [
											{
												type: "PrimaryExpression",
												children: [
													{
														type: "Identifier",
														value: "c",
													},
												],
											},
										],
									},
								],
							},
							{
								type: "=",
								value: "=",
							},
							{
								type: "AssignmentExpression",
								children: [
									{
										type: "AdditiveExpression",
										children: [
											{
												type: "MultiplicativeExpression",
												children: [
													{
														type: "LeftHandSideExpression",
														children: [
															{
																type: "MemberExpression",
																children: [
																	{
																		type: "new",
																		value: "new",
																	},
																	{
																		type: "MemberExpression",
																		children:
																			[
																				{
																					type: "PrimaryExpression",
																					children:
																						[
																							{
																								type: "Identifier",
																								value: "A",
																							},
																						],
																				},
																			],
																	},
																	{
																		type: "(",
																		value: "(",
																	},
																	{
																		type: ")",
																		value: ")",
																	},
																],
															},
														],
													},
												],
											},
										],
									},
								],
							},
						],
					},
				],
			},
		]);
	});

	test("Class", () => {
		const testCase = "c = new A()";
		const list = genExpression(testCase);
		const ast = expressionParser(
			genInitState({
				Expression: {
					EOF: {
						$finish: true,
					},
				},
			}),
			genGrammar([
				[
					"Literal",
					[
						["BooleanLiteral"],
						["NullLiteral"],
						["StringLiteral"],
						["NumericLiteral"],
					],
				],
				[
					"PrimaryExpression",
					[
						["(", "Expression", ")"],
						["Identifier"],
						["Literal"],
						["FunctionExpression"],
						["new", "MemberExpression", "Arguments"],
					],
				],
				[
					"MemberExpression",
					[
						["PrimaryExpression"],
						["MemberExpression", ".", "Identifier"],
						["MemberExpression", "[", "Expression", "]"],
						["new", "MemberExpression", "Arguments"],
					],
				],
				[
					"CallExpression",
					[
						["MemberExpression", "Arguments"],
						["CallExpression", "Arguments"],
						["MemberExpression", ".", "Identifier", "Arguments"],
						[
							"MemberExpression",
							"[",
							"Expression",
							"]",
							"Arguments",
						],
						["PrimaryExpression", "Arguments"],
					],
				],
				[
					"Arguments",
					[
						["(", ")"],
						["(", "ArgumentList", ")"],
					],
				],
				[
					"ArgumentList",
					[
						["AssignmentExpression"],
						["ArgumentList", ",", "AssignmentExpression"],
					],
				],
				[
					"LeftHandSideExpression",
					[["CallExpression"], ["MemberExpression"]],
				],
				[
					"AssignmentExpression",
					[
						["ConditionalExpression"],
						["LeftHandSideExpression", "=", "AssignmentExpression"],
						[
							"LeftHandSideExpression",
							"+=",
							"AssignmentExpression",
						],
						[
							"LeftHandSideExpression",
							"-=",
							"AssignmentExpression",
						],
						[
							"LeftHandSideExpression",
							"*=",
							"AssignmentExpression",
						],
						[
							"LeftHandSideExpression",
							"/=",
							"AssignmentExpression",
						],
					],
				],
				[
					"ConditionalExpression",
					[
						["LogicalORExpression"],
						[
							"LogicalORExpression",
							"?",
							"AssignmentExpression",
							":",
							"AssignmentExpression",
						],
					],
				],
				[
					"LogicalORExpression",
					[
						["LogicalANDExpression"],
						["LogicalORExpression", "||", "LogicalANDExpression"],
					],
				],
				[
					"LogicalANDExpression",
					[
						["EqualityExpression"],
						["LogicalANDExpression", "&&", "EqualityExpression"],
					],
				],
				[
					"EqualityExpression",
					[
						["RelationalExpression"],
						["EqualityExpression", "==", "RelationalExpression"],
						["EqualityExpression", "!=", "RelationalExpression"],
					],
				],
				[
					"RelationalExpression",
					[
						["AdditiveExpression"],
						["RelationalExpression", "<", "AdditiveExpression"],
						["RelationalExpression", ">", "AdditiveExpression"],
						["RelationalExpression", "<=", "AdditiveExpression"],
						["RelationalExpression", ">=", "AdditiveExpression"],
					],
				],
				[
					"AdditiveExpression",
					[
						["MultiplicativeExpression"],
						["AdditiveExpression", "+", "MultiplicativeExpression"],
						["AdditiveExpression", "-", "MultiplicativeExpression"],
					],
				],
				[
					"MultiplicativeExpression",
					[
						["LeftHandSideExpression"],
						[
							"MultiplicativeExpression",
							"*",
							"LeftHandSideExpression",
						],
						[
							"MultiplicativeExpression",
							"/",
							"LeftHandSideExpression",
						],
						[
							"MultiplicativeExpression",
							"%",
							"LeftHandSideExpression",
						],
					],
				],
				[
					"Expression",
					[
						["AssignmentExpression"],
						["Expression", ",", "AssignmentExpression"],
					],
				],
			]),
			list
		);
		console.log(JSON.stringify(ast, null, 4));
		// expect(ast).toStrictEqual([]);
	});
});
