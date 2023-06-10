import { describe, expect, test } from "@jest/globals";
import genExpression from "../src/js-lexical";
import Grammar from "../src/javascript-grammar";
import expressionParser from "../src";
import evaluate, { globalEnv } from "../src/evaluate";
import { genGrammar, genInitState } from "../src/helper";

describe("test primary expression", () => {
	test("test LexicalDeclaration with keyword let", () => {
		const testCase = `
            let a = 0;
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
		expect(globalEnv.get("a")).toBe(0);
	});

	test("test LexicalDeclaration with operator", () => {
		const testCase = `
            let a = 0;
            a = a + 1;
            a = a + 1;
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
		expect(globalEnv.get("a")).toBe(2);
	});

	test("test LexicalDeclaration with nested blocks", () => {
		const testCase = `
            let a = 0;
            {
                let b = a + 1;
                b + 1;
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
		expect(res).toBe(2);
	});
});
