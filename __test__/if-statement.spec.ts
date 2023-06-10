import { describe, expect, test } from "@jest/globals";
import genExpression from "../src/js-lexical";
import Grammar from "../src/javascript-grammar";
import expressionParser from "../src";
import evaluate from "../src/evaluate";
import { genGrammar, genInitState } from "../src/helper";

describe("test if statement analyze", () => {
	test("condition is true", () => {
		const testCase = `
            if (true) {
                const a = 1;
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
		expect(res).toBe(void 0);
	});
});