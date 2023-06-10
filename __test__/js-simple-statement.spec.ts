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
	test("Literal", () => {
		const testCase = "11";
		const list = genExpression(testCase);
		const ast = expressionParser(
			genInitState({
				Literal: {
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
			]),
			list
		);
		expect(ast).toStrictEqual([
			{
				type: "Literal",
				children: [
					{
						type: "NumericLiteral",
						value: "11",
					},
				],
			},
		]);
	});
	test("PrimaryExpression", () => {
		const testCase = "111";
		const list = genExpression(testCase);
		const ast = expressionParser(
			genInitState({
				PrimaryExpression: {
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
			]),
			list
		);
		expect(ast).toStrictEqual([
			{
				type: "PrimaryExpression",
				children: [
					{
						type: "Literal",
						children: [
							{
								type: "NumericLiteral",
								value: "111",
							},
						],
					},
				],
			},
		]);
	});
	test("MemberExpression", () => {
		const testCase = "a.b";
		const list = genExpression(testCase);
		const ast = expressionParser(
			genInitState({
				MemberExpression: {
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
			]),
			list
		);
		expect(ast).toStrictEqual([
			{
				type: "MemberExpression",
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
					{
						type: ".",
						value: ".",
					},
					{
						type: "Identifier",
						value: "b",
					},
				],
			},
		]);
	});
	test("AdditiveExpression", () => {
		const testCase = "a.c + 2 * 3 - 4";
		const list = genExpression(testCase);
		const ast = expressionParser(
			genInitState({
				AdditiveExpression: {
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
						// ["new", "MemberExpression"],
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
					"NweExpression",
					[
						["MemberExpression"],
						["new", "NweExpression"],
					],
				],
				[
					"MultiplicativeExpression",
					[
						["CallExpression"],
						["NweExpression"],
						["MultiplicativeExpression", "*", "MemberExpression"],
						["MultiplicativeExpression", "/", "MemberExpression"],
						["MultiplicativeExpression", "%", "MemberExpression"],
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
			]),
			list
		);
		expect(ast).toStrictEqual([
			{
				type: "AdditiveExpression",
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
												type: "MemberExpression",
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
													{
														type: ".",
														value: ".",
													},
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
								type: "+",
								value: "+",
							},
							{
								type: "MultiplicativeExpression",
								children: [
									{
										type: "MultiplicativeExpression",
										children: [
											{
												type: "MemberExpression",
												children: [
													{
														type: "PrimaryExpression",
														children: [
															{
																type: "Literal",
																children: [
																	{
																		type: "NumericLiteral",
																		value: "2",
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
										type: "*",
										value: "*",
									},
									{
										type: "MemberExpression",
										children: [
											{
												type: "PrimaryExpression",
												children: [
													{
														type: "Literal",
														children: [
															{
																type: "NumericLiteral",
																value: "3",
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
						type: "-",
						value: "-",
					},
					{
						type: "MultiplicativeExpression",
						children: [
							{
								type: "MemberExpression",
								children: [
									{
										type: "PrimaryExpression",
										children: [
											{
												type: "Literal",
												children: [
													{
														type: "NumericLiteral",
														value: "4",
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
});
