import { ClosureState } from "../src/closure";
import { describe, expect, test } from "@jest/globals";
import genExpression from "../src/js-lexical";
import Grammar from "../src/javascript-grammar";
import expressionParser from "../src";
import evaluate, { globalEnv } from "../src/evaluate";
const genGrammar = (grammar: [string, string[][]][]) => {
	const map = new Map(grammar);
	return map;
};
const genInitState = (state: any) => {
	return state as ClosureState;
};
describe("test lr analysis", () => {

	test("declaration & assignment class instance", () => {
		const testCase = "1 + 1;";
		const list = genExpression(testCase);
		const ast = expressionParser(
			genInitState({
				Program: {
					EOF: {
						$finish: true,
					},
				},
			}),
			genGrammar(Grammar),
			list
		);
    const res = evaluate(ast[0]);
    expect(res).toBe(2);
	});

	test("ifStatement", () => {
		const testCase = "if (true) const b = c";
		const list = genExpression(testCase);
		const ast = expressionParser(
			genInitState({
				Program: {
					EOF: {
						$finish: true,
					},
				},
			}),
			genGrammar(Grammar),
			list
		);
		const res = evaluate(ast[0]);
		expect(res).toBe(undefined);
	});
	test("test let add", () => {
		const testCase = "let b = 1; b = b + 1";
		const list = genExpression(testCase);
		const ast = expressionParser(
			genInitState({
				Program: {
					EOF: {
						$finish: true,
					},
				},
			}),
			genGrammar(Grammar),
			list
		);
		const res = evaluate(ast[0]);
		console.log(globalEnv);
		// expect(res).toBe(undefined);
	});

		test("nested", () => {
			const testCase = `
			{
				let a = 1;
				{
					let b = a + 1;
					b + 1;
				}
			}
			`;
			const list = genExpression(testCase);
			const ast = expressionParser(
				genInitState({
					Program: {
						EOF: {
							$finish: true,
						},
					},
				}),
				genGrammar(Grammar),
				list
			);
			const res = evaluate(ast[0]);
			expect(res).toBe(3);
		});
});


