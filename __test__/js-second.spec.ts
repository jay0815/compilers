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
			genGrammar(Grammar),
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
	test("simple additive statement", () => {
		const testCase = "1+1;";
		const list = genExpression(testCase);
		const ast = expressionParser(
			genInitState({
				Statement: {
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
				[
					"Statement",
					[
						["ExpressionStatement"],
						["IfStatement"],
						["ForStatement"],
						["Declaration"],
					],
				],
				["ExpressionStatement", [["Expression", ";"]]],
				[
					"Declaration",
					[
						["var", "Identifier", "=", "Expression", ";"],
						["let", "Identifier", "=", "Expression", ";"],
						["const", "Identifier", "=", "Expression", ";"],
					],
				],
				[
					"IfStatement",
					[
						["if", "(", "Expression", ")", "Statement"],
						[
							"if",
							"(",
							"Expression",
							")",
							"Statement",
							"else",
							"Statement",
						],
					],
				],
				[
					"ForStatement",
					[
						[
							"for",
							"(",
							"Expression",
							";",
							"Expression",
							";",
							"Expression",
							")",
							"Statement",
						],
					],
				],
			]),
			list
		);
		console.log(JSON.stringify(ast));
		expect(ast).toStrictEqual([
			{
				type: "Statement",
				children: [
					{
						type: "ExpressionStatement",
						children: [
							{
								type: "Expression",
								children: [
									{
										type: "AssignmentExpression",
										children: [
											{
												type: "AdditiveExpression",
												children: [
													{
														type: "AdditiveExpression",
														children: [
															{
																type: "MultiplicativeExpression",
																children: [
																	{
																		type: "LeftHandSideExpression",
																		children:
																			[
																				{
																					type: "MemberExpression",
																					children:
																						[
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
													{ type: "+", value: "+" },
													{
														type: "MultiplicativeExpression",
														children: [
															{
																type: "LeftHandSideExpression",
																children: [
																	{
																		type: "MemberExpression",
																		children:
																			[
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
							{ type: ";", value: ";" },
						],
					},
				],
			},
		]);
	});
	test("assignment with not declaration", () => {
		const testCase = "a = 1+1;";
		const list = genExpression(testCase);
		const ast = expressionParser(
			genInitState({
				Statement: {
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
				[
					"Statement",
					[
						["ExpressionStatement"],
						["IfStatement"],
						["ForStatement"],
						["Declaration"],
					],
				],
				["ExpressionStatement", [["Expression", ";"]]],
				[
					"Declaration",
					[
						["var", "Identifier", "=", "Expression", ";"],
						["let", "Identifier", "=", "Expression", ";"],
						["const", "Identifier", "=", "Expression", ";"],
					],
				],
				[
					"IfStatement",
					[
						["if", "(", "Expression", ")", "Statement"],
						[
							"if",
							"(",
							"Expression",
							")",
							"Statement",
							"else",
							"Statement",
						],
					],
				],
				[
					"ForStatement",
					[
						[
							"for",
							"(",
							"Expression",
							";",
							"Expression",
							";",
							"Expression",
							")",
							"Statement",
						],
					],
				],
			]),
			list
		);
		expect(ast).toStrictEqual([
			{
				type: "Statement",
				children: [
					{
						type: "ExpressionStatement",
						children: [
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
																type: "AdditiveExpression",
																children: [
																	{
																		type: "MultiplicativeExpression",
																		children:
																			[
																				{
																					type: "LeftHandSideExpression",
																					children:
																						[
																							{
																								type: "MemberExpression",
																								children:
																									[
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
															{
																type: "+",
																value: "+",
															},
															{
																type: "MultiplicativeExpression",
																children: [
																	{
																		type: "LeftHandSideExpression",
																		children:
																			[
																				{
																					type: "MemberExpression",
																					children:
																						[
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
							{
								type: ";",
								value: ";",
							},
						],
					},
				],
			},
		]);
	});
	test("assignment with declaration", () => {
		const testCase = "let a = 1+1;";
		const list = genExpression(testCase);
		const ast = expressionParser(
			genInitState({
				Statement: {
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
				[
					"Statement",
					[
						["ExpressionStatement"],
						["IfStatement"],
						["ForStatement"],
						["Declaration"],
					],
				],
				["ExpressionStatement", [["Expression", ";"]]],
				[
					"Declaration",
					[
						["var", "Identifier", "=", "Expression", ";"],
						["let", "Identifier", "=", "Expression", ";"],
						["const", "Identifier", "=", "Expression", ";"],
					],
				],
				[
					"IfStatement",
					[
						["if", "(", "Expression", ")", "Statement"],
						[
							"if",
							"(",
							"Expression",
							")",
							"Statement",
							"else",
							"Statement",
						],
					],
				],
				[
					"ForStatement",
					[
						[
							"for",
							"(",
							"Expression",
							";",
							"Expression",
							";",
							"Expression",
							")",
							"Statement",
						],
					],
				],
			]),
			list
		);
		expect(ast).toStrictEqual([
			{
				type: "Statement",
				children: [
					{
						type: "Declaration",
						children: [
							{ type: "let", value: "let" },
							{ type: "Identifier", value: "a" },
							{ type: "=", value: "=" },
							{
								type: "Expression",
								children: [
									{
										type: "AssignmentExpression",
										children: [
											{
												type: "AdditiveExpression",
												children: [
													{
														type: "AdditiveExpression",
														children: [
															{
																type: "MultiplicativeExpression",
																children: [
																	{
																		type: "LeftHandSideExpression",
																		children:
																			[
																				{
																					type: "MemberExpression",
																					children:
																						[
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
													{ type: "+", value: "+" },
													{
														type: "MultiplicativeExpression",
														children: [
															{
																type: "LeftHandSideExpression",
																children: [
																	{
																		type: "MemberExpression",
																		children:
																			[
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
							{ type: ";", value: ";" },
						],
					},
				],
			},
		]);
	});
	
	test("declaration & assignment class instance", () => {
		const testCase = "let c = new A();";
		const list = genExpression(testCase);
		const ast = expressionParser(
			genInitState({
				Statement: {
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
						["MemberExpression", ".", "Identifier"],
						["MemberExpression", "[", "Expression", "]"],
					],
				],
				[
					"MemberExpression",
					[
						["PrimaryExpression"],
						["MemberExpression", ".", "Identifier"],
						["MemberExpression", "[", "Expression", "]"],
					],
				],
				[
					"CallExpression",
					[
						["new", "MemberExpression", "(", ")"],
						["MemberExpression", "(", ")"],
						["CallExpression", ".", "Identifier"],
						["CallExpression", "[", "Expression", "]"],
						["CallExpression", "(", "Arguments", ")"],
					],
				],
				[
					"NewExpression",
					[["MemberExpression"], ["new", "NewExpression"]],
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
				[
					"LeftHandSideExpression",
					[
						["CallExpression"],
						["NewExpression"],
					],
				],
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
				[
					"Statement",
					[
						["ExpressionStatement"],
						["IfStatement"],
						["ForStatement"],
						["Declaration"],
					],
				],
				["ExpressionStatement", [["Expression", ";"]]],
				[
					"Declaration",
					[
						["var", "Identifier", "=", "Expression", ";"],
						["let", "Identifier", "=", "Expression", ";"],
						["const", "Identifier", "=", "Expression", ";"],
					],
				],
				[
					"IfStatement",
					[
						["if", "(", "Expression", ")", "Statement"],
						[
							"if",
							"(",
							"Expression",
							")",
							"Statement",
							"else",
							"Statement",
						],
					],
				],
				[
					"ForStatement",
					[
						[
							"for",
							"(",
							"Expression",
							";",
							"Expression",
							";",
							"Expression",
							")",
							"Statement",
						],
					],
				],
			]),
			list
		);
		console.log(JSON.stringify(ast, null, 4));
		// expect(ast).toStrictEqual([
		// 	{
		// 		type: "Statement",
		// 		children: [
		// 			{
		// 				type: "Declaration",
		// 				children: [
		// 					{
		// 						type: "let",
		// 						value: "let",
		// 					},
		// 					{
		// 						type: "Identifier",
		// 						value: "c",
		// 					},
		// 					{
		// 						type: "=",
		// 						value: "=",
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
		// 																children:
		// 																	[
		// 																		{
		// 																			type: "new",
		// 																			value: "new",
		// 																		},
		// 																		{
		// 																			type: "MemberExpression",
		// 																			children:
		// 																				[
		// 																					{
		// 																						type: "PrimaryExpression",
		// 																						children:
		// 																							[
		// 																								{
		// 																									type: "Identifier",
		// 																									value: "A",
		// 																								},
		// 																							],
		// 																					},
		// 																				],
		// 																		},
		// 																		{
		// 																			type: "(",
		// 																			value: "(",
		// 																		},
		// 																		{
		// 																			type: ")",
		// 																			value: ")",
		// 																		},
		// 																	],
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
		// 						type: ";",
		// 						value: ";",
		// 					},
		// 				],
		// 			},
		// 		],
		// 	},
		// ]);
	});
});
