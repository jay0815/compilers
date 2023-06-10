import { describe, expect, test } from "@jest/globals";
import genExpression from "../src/js-lexical";
import Grammar from "../src/javascript-grammar";
import expressionParser from "../src";
import evaluate, { globalEnv }  from "../src/evaluate";
import { genGrammar, genInitState } from "../src/helper";

describe("test for statement analyze", () => {
	test("condition is true", () => {
		const testCase = `
            let b = 0;
            for (let i = 1; i < 10; i++) {
                b = b + i;
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
		evaluate(ast[0]);
		expect(globalEnv.get('b')).toBe(45);
	});
});
