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
describe("test function declaration", () => {
	test("test func a", () => {
		const testCase = "function a() { let b = 2; }";
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
		evaluate(ast[0]);
    console.log(globalEnv.get("a"));
		// expect(globalEnv.get("a")).toBe(2);
	});

		test("test func call", () => {
			const testCase = `
			let b = 1;
			function a() { let b = 2; }
			a();
			b = b + 2;
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
			evaluate(ast[0]);
			console.log(globalEnv.get("b"));
			// expect(globalEnv.get("a")).toBe(2);
		});

		test("test promise", () => {
					const testCase = `
			let b = 1;
			function resolve() { let b = 2; }
			function then() { b = b + 2; }
			const p = new Promise(resolve);
			p.then(then)
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
					evaluate(ast[0]);
					console.log(globalEnv.get("b"));
					// expect(globalEnv.get("a")).toBe(2);
				});
});
