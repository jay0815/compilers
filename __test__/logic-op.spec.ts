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
describe("test condition expression", () => {
	test("test or op", () => {
		const testCase = "let a = 1 || 2";
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
    expect(globalEnv.get("a")).toBe(2);
	});
	
});
