import { Token } from "./index";
import Reference from "./reference";
import Environment from "./Environment";
import Completion from "./Completion";
// import { JSFunction, JSObject, PromiseFunction } from "./baseType";
import { JSObject } from "./baseType";
import { Identifier } from './js-lexical';
import genExpression from "./js-lexical";
import { ClosureState } from "./closure";
import Grammar from "./javascript-grammar";
import expressionParser from "./index";

const genGrammar = (grammar: [string, string[][]][]) => {
	const map = new Map(grammar);
	return map;
};
const genInitState = (state: any) => {
	return state as ClosureState;
};
export type Node = { type: string; children: Token[] };
export type NodeTypes = keyof Evaluator;

const evaluate = (ast: Token): any => {
	return evaluator[
		ast.type as Exclude<
			NodeTypes,
			| "envStack"
			| "currentEnv"
			| "microTaskQueue"
			| "runTask"
			| "preProcessor"
		>
	](ast as any);
};

export const globalEnv = new Environment();

globalEnv.identifier("Promise");

const evaluator = {
	envStack: [globalEnv] as Environment[],
	microTaskQueue: [] as any[],
	evaluate(ast: Token): any {
		return this[
			ast.type as Exclude<
				NodeTypes,
				| "envStack"
				| "currentEnv"
				| "microTaskQueue"
				| "runTask"
				| "preProcessor"
			>
		](ast as any);
	},
	evaluateString(sourceCode: string) {
		const list = genExpression(sourceCode);
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
		this.evaluate(ast[0]);
		this.runTask()
	},
	// drain
	runTask() {
		// 宏任务
		while (this.microTaskQueue.length) {
			const current = this.microTaskQueue.shift();
			if (current) {
				current.run();
			}
		}
	},
	get currentEnv() {
		return this.envStack[this.envStack.length - 1];
	},
	preProcessor: {
		// eval("var a = 1;"); 会报错，因为 const 也存在预处理
		// const a = 2;
		// todo
	},
	Program(node: Node) {
		return this.evaluate(node.children[0]);
	},
	StatementListItem(node: Node) {
		return this.evaluate(node.children[0]);
	},
	StatementList(node: Node) {
		if (node.children.length === 1) {
			return this.evaluate(node.children[0]);
		}
		const completion = this.evaluate(node.children[0]);
		if (completion.type === "normal") {
			return this.evaluate(node.children[1]);
		}
		return completion;
	},
	Statement(node: Node) {
		const res = this.evaluate(node.children[0]);
		return res;
	},
	ExpressionStatement(node: Node) {
		return new Completion("normal", evaluate(node.children[0]));
	},
	BreakStatement(node: Node) {
		return new Completion("break");
	},
	ContinueStatement(node: Node) {
		return new Completion("continue");
	},
	IfStatement(node: Node) {
		const size = node.children.length;
		if (size === 5) {
			const condition = evaluate(node.children[2]);
			if (condition) {
				return evaluate(node.children[4]);
			} else {
				return new Completion("normal");
			}
		} else if (size === 7) {
			const condition = evaluate(node.children[2]);
			if (condition) {
				return evaluate(node.children[4]);
			} else {
				return evaluate(node.children[6]);
			}
		}
	},
	ForStatement(node: Node) {
		const size = node.children.length;
		if (size === 9) {
			// 初始化 变量
			evaluate(node.children[2]);
			while (true) {
				const condition = evaluate(node.children[4]);
				if (!condition) {
					// 当不满足 condition 时，退出循环
					return new Completion("normal");
				}
				// 执行 循环体 statementList
				const completion = evaluate(node.children[8]);
				if (completion.type === "break") {
					return new Completion("normal");
				} else if (completion.type === "continue") {
					continue;
				} else {
					// update
					evaluate(node.children[6]);
				}
			}
		}
	},
	WhileStatement(node: Node) {
		const size = node.children.length;
		if (size === 5) {
			while (true) {
				const condition = evaluate(node.children[2]);
				if (!condition) {
					// 当不满足 condition 时，退出循环
					break;
				}
				// 执行 循环体 statementList
				const completion = evaluate(node.children[4]);
				if (completion.type === "break") {
					return new Completion("normal");
				} else if (completion.type === "continue") {
					continue;
				}
			}
		}
	},
	UpdateExpression(node: Node) {
		const size = node.children.length;
		if (size === 1) {
			return evaluate(node.children[0]);
		} else if (size === 2) {
			const ref = evaluate(node.children[0]) as Reference;
			if (node.children[1].type === "++") {
				ref.set(ref.get() + 1);
			} else if (node.children[1].type === "--") {
				ref.set(ref.get() - 1);
			}
			return ref.get();
		}
	},
	UnaryExpression(node: Node) {
		const size = node.children.length;
		if (size === 1) {
			return evaluate(node.children[0]);
		}
	},
	ShiftExpression(node: Node) {
		const size = node.children.length;
		if (size === 1) {
			return this.evaluate(node.children[0]);
		} else if (size === 3) {
			let left = this.evaluate(node.children[0]);
			if (left instanceof Reference) {
				left = left.get();
			}
			let right = this.evaluate(node.children[2]);
			if (right instanceof Reference) {
				right = right.get();
			}
			if (node.children[1].type === "<<") {
				return left << right;
			} else if (node.children[1].type === ">>") {
				return left >> right;
			} else if (node.children[1].type === ">>>") {
				return left >>> right;
			}
		}
	},
	RelationalExpression(node: Node) {
		const size = node.children.length;
		if (size === 1) {
			return this.evaluate(node.children[0]);
		} else if (size === 3) {
			let left = this.evaluate(node.children[0]);
			if (left instanceof Reference) {
				left = left.get();
			}
			let right = this.evaluate(node.children[2]);
			if (right instanceof Reference) {
				right = right.get();
			}
			if (node.children[1].type === "<") {
				return left < right;
			} else if (node.children[1].type === ">") {
				return left > right;
			} else if (node.children[1].type === "<=") {
				return left <= right;
			} else if (node.children[1].type === ">=") {
				return left >= right;
			}
		}
	},
	EqualityExpression(node: Node) {
		const size = node.children.length;
		if (size === 1) {
			return this.evaluate(node.children[0]);
		} else if (size === 3) {
			let left = this.evaluate(node.children[0]);
			if (left instanceof Reference) {
				left = left.get();
			}
			let right = this.evaluate(node.children[2]);
			if (right instanceof Reference) {
				right = right.get();
			}
			if (node.children[1].type === "==") {
				return left == right;
			} else if (node.children[1].type === "!=") {
				return left != right;
			} else if (node.children[1].type === "===") {
				return left === right;
			} else if (node.children[1].type === "!==") {
				return left !== right;
			}
		}
	},
	ConditionalExpression(node: Node) {
		const size = node.children.length;
		if (size === 1) {
			return this.evaluate(node.children[0]);
		} else if (size === 5) {
			const condition = this.evaluate(node.children[0]);
			if (condition) {
				return this.evaluate(node.children[2]);
			} else {
				return this.evaluate(node.children[4]);
			}
		}
	},
	LogicalORExpression(node: Node) {
		const size = node.children.length;
		if (size === 1) {
			return this.evaluate(node.children[0]);
		} else if (size === 3) {
			let left = this.evaluate(node.children[0]);
			if (left instanceof Reference) {
				left = left.get();
			}
			if (left) {
				return this.evaluate(node.children[2]);
			} else {
				return left;
			}
		}
	},
	LogicalANDExpression(node: Node) {
		const size = node.children.length;
		if (size === 1) {
			return this.evaluate(node.children[0]);
		} else if (size === 3) {
			let left = this.evaluate(node.children[0]);
			if (left instanceof Reference) {
				left = left.get();
			}
			if (left) {
				return this.evaluate(node.children[2]);
			} else {
				return false;
			}
		}
	},
	BitwiseORExpression(node: Node) {
		const size = node.children.length;
		if (size === 1) {
			return this.evaluate(node.children[0]);
		} else if (size === 3) {
			let left = this.evaluate(node.children[0]);
			if (left instanceof Reference) {
				left = left.get();
			}
			let right = this.evaluate(node.children[2]);
			if (right instanceof Reference) {
				right = right.get();
			}
			return left | right;
		}
	},
	BitwiseXORExpression(node: Node) {
		const size = node.children.length;
		if (size === 1) {
			return this.evaluate(node.children[0]);
		} else if (size === 3) {
			let left = this.evaluate(node.children[0]);
			if (left instanceof Reference) {
				left = left.get();
			}
			let right = this.evaluate(node.children[2]);
			if (right instanceof Reference) {
				right = right.get();
			}
			return left ^ right;
		}
	},
	BitwiseANDExpression(node: Node) {
		const size = node.children.length;
		if (size === 1) {
			return this.evaluate(node.children[0]);
		} else if (size === 3) {
			let left = this.evaluate(node.children[0]);
			if (left instanceof Reference) {
				left = left.get();
			}
			let right = this.evaluate(node.children[2]);
			if (right instanceof Reference) {
				right = right.get();
			}
			return left & right;
		}
	},
	BlockStatement(node: Node) {
		const size = node.children.length;
		if (size === 2) {
			// 空 的 block statement
			return new Completion("normal");
		} else if (size === 3) {
			// 创建一个新的 block scope 环境
			this.envStack.push(new Environment(this.currentEnv));
			const res = this.evaluate(node.children[1]);
			// 恢复 当前层级 环境变量
			this.envStack.pop();
			return res;
		}
	},
	Expression(node: Node) {
		return this.evaluate(node.children[0]);
	},
	AssignmentExpression(node: Node) {
		const size = node.children.length;
		if (size === 1) {
			return this.evaluate(node.children[0]);
		} else if (size === 3) {
			if (node.children[1].type === "=") {
				const ref = this.evaluate(node.children[0]) as Reference;
				const value = this.evaluate(node.children[2]);
				ref.set(value);
			} else {
				//  AssignmentOperator
				// *= /= %= += -= <<= >>= >>>= &= ^= |= **=
			}
		}
	},
	AdditiveExpression(node: Node) {
		if (node.children.length === 1) {
			return this.evaluate(node.children[0]);
		} else {
			// 当 left 和 right 都是 number 类型时，直接计算
			// 当 left 和 right 都是 Reference 类型时, 先获取具体值，再计算
			let left = this.evaluate(node.children[0]);
			if (left instanceof Reference) {
				left = left.get();
			}
			let right = this.evaluate(node.children[2]);
			if (right instanceof Reference) {
				right = right.get();
			}
			if (node.children[1].type === "+") {
				return left + right;
			} else if (node.children[1].type === "-") {
				return left - right;
			}
		}
	},
	MultiplicativeExpression(node: Node) {
		if (node.children.length === 1) {
			return this.evaluate(node.children[0]);
		} else {
			const left = this.evaluate(node.children[0]);
			const right = this.evaluate(node.children[2]);
			if (node.children[1].type === "*") {
				return left * right;
			} else if (node.children[1].type === "/") {
				return left / right;
			} else if (node.children[1].type === "%") {
				return left % right;
			}
		}
	},
	LeftHandSideExpression(node: Node) {
		return this.evaluate(node.children[0]);
	},
	MemberExpression(node: Node) {
		// 返回内容不应该是 具体值 而应该是一个 reference
		if (node.children.length === 1) {
			return this.evaluate(node.children[0]);
		} else if (node.children.length === 3) {
			if (node.children[1].type === ".") {
				const reference = new Reference(
					this.evaluate(node.children[0]),
					this.evaluate(node.children[2])
				);
				return reference;
			}
		} else if (node.children.length === 4) {
			if (node.children[0].type === "MemberExpression") {
				const reference = new Reference(
					this.evaluate(node.children[0]),
					this.evaluate(node.children[2])
				);
				return reference;
			}
		}
	},
	CoverCallExpressionAndAsyncArrowHead(node: Node) {
		const size = node.children.length;
		if (size === 3) {

		}
	},
	CallExpression(node: Node) {
		const size = node.children.length;
		if (size === 4) {
			if (node.children[0].type === "MemberExpression") {
				const ref = this.evaluate(node.children[0]);
				const func = ref.get();
				return func.call();
			} else if (node.children[0].type === "CallExpression") {
				const func = this.evaluate(node.children[0]);
				return func.call();
			}
		} else if (size === 3) {
			if (node.children[0].type === "MemberExpression") {
				const ref = this.evaluate(node.children[0]);
				const func = ref.get();
				return func.call();
			} else if (node.children[0].type === "CallExpression") {
				const func = this.evaluate(node.children[0]);
				return func.call();
			}
		} else if (size === 5) {
			// for new MemberExpression ( Arguments )
			const funRef = this.evaluate(node.children[1]);
			const func = funRef.get();
			const argsRef = this.evaluate(node.children[3]);
			const args = argsRef.get();
			return func.construct(args);
		}
	},
	NewExpression(node: Node) {
		const size = node.children.length;
		if (size === 1) {
			return this.evaluate(node.children[0]);
		} else if (size === 2) {
			return this.evaluate(node.children[1]);
		}
	},
	PrimaryExpression(node: Node) {
		if (node.children.length === 1) {
			return this.evaluate(node.children[0]);
		} else if (node.children.length === 3) {
			return this.evaluate(node.children[1]);
		}
	},
	Literal(node: Node) {
		return this.evaluate(node.children[0]);
	},
	NullLiteral(node: Node) {
		return null;
	},
	StringLiteral(node: Node) {
		// todo convert value to string
		const str = String((node as any).value);
		// todo 补充完整的处理逻辑
		if (
			(str.startsWith("'") && str.endsWith("'")) ||
			(str.startsWith('"') && str.endsWith('"'))
		) {
			return str.slice(1, -1);
		}
		return str;
	},
	NumberLiteral(node: Node) {
		// todo calculate number with IEEE 754
		return Number((node as any).value);
	},
	BooleanLiteral(node: Node) {
		const bool = (node as any).value;
		if (bool === "true") {
			return true;
		}
		return false;
	},
	ObjectLiteral(node: Node) {
		const size = node.children.length;
		if (size === 2) {
			const innerObject = new JSObject();
			return innerObject;
		} else if (size === 3) {
			const innerObject = new JSObject();
			(node.children[1] as any).children.forEach((property: any) => {
				if (property.children.length === 3) {
					const key = this.evaluate(property.children[0]);
					const value = this.evaluate(property.children[2]);
					innerObject.setProperty(key, value);
				}
			});
			return innerObject;
		}
	},
	// PropertyList(node: Node) {},
	// Property(node: Node) {},
	Declaration(node: Node) {
		return this.evaluate(node.children[0]);
	},
	Parameters(node: Node) {
		const size = node.children.length;
		if (size === 1) {
			const name = (node.children[0] as any).value;
			return [name];
		} else if (size === 3) {
			const name = (node.children[2] as any).value;
			const rest = this.evaluate(node.children[0]);
			return [...rest, name];
		}
	},
	LexicalDeclaration(node: Node) {
		const name = (node.children[1] as any).value;
		this.currentEnv.set(name, void 0);
		const ref = this.evaluate(node.children[1]) as Reference;
		const value = this.evaluate(node.children[3]);
		ref.set(value);
		return new Completion("normal");
	},
	FunctionDeclaration(node: Node) {
		const size = node.children.length;
		const name = (node.children[1] as any).value;
		if (size === 7) {
			// const func = new JSFunction(
			// 	node.children[5] as any,
			// 	evaluator,
			// 	this.currentEnv,
			// 	[]
			// );
			// this.currentEnv.identifier(name);
			// this.currentEnv.set(name, func);
		} else {
			// const func = new JSFunction(
			// 	node.children[6] as any,
			// 	evaluator,
			// 	this.currentEnv,
			// 	[]
			// );
			// this.currentEnv.identifier(name);
			// this.currentEnv.set(name, func);
		}

		return new Completion("normal");
	},
	Identifier(node: Node) {
		type Identifier = {
			type: "Identifier";
			value: string;
		};
		const reference = new Reference(
			this.currentEnv,
			(node as unknown as Identifier).value
		);
		return reference;
	},
};

export type Evaluator = typeof evaluator;

export default evaluator;