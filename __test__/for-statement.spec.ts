import { describe, expect, test } from "@jest/globals";
import genExpression from "../src/js-lexical";
import Grammar from "../src/javascript-grammar";
import expressionParser from "../src";
import evaluate, { globalEnv } from "../src/evaluate";
import { genGrammar, genInitState } from "../src/helper";

describe("test for statement analyze", () => {
	test("condition is true", () => {
		const testCase = `
            let b = 0;
						let i = 0;
            for (i = 1; i < 10; i++) {
                b = b + 1;
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
		expect(globalEnv.get("b")).toBe(9);
	});

	test("for with break", () => {
		const testCase = `
						let i = 0;
            for (i = 1; i < 10; i++) {
								break;
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
		expect(globalEnv.get("i")).toBe(1);
	});

	test("break in condition", () => {
		const testCase = `
						let i = 0;
            for (i = 1; i < 10; i++) {
							if (i == 2) {
								break;
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
		evaluate(ast[0]);
		expect(globalEnv.get("i")).toBe(2);
	});
});
