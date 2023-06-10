import { Token } from "./index";
import Reference from "./reference";
import Environment from "./Environment";
// import { BooleanLiteral } from './javascript-lexical';

type Node = { type: string; children: Token[] };
type Types = keyof typeof evaluator;

// const evaluateAst = (ast: Token[]) => {
// 	const node = ast[0];
// 	return evaluator[node.type as Types](node as Node);
// };

const evaluate = (ast: Token): any => {
	// console.log(ast.type);
	return evaluator[ast.type as Exclude<Types, 'stack'>](ast as any);
};

export const globalEnv = new Environment();

const evaluator = {
	stack: [globalEnv] as Environment[],
	currentEnv() {
		return this.stack[this.stack.length - 1];
	},
	Program(node: Node) {
		return evaluate(node.children[0]);
	},
	StatementListItem(node: Node) {
		return evaluate(node.children[0]);
	},
	StatementList(node: Node) {
		if (node.children.length === 1) {
			return evaluate(node.children[0]);
		}
		evaluate(node.children[0]);
		return evaluate(node.children[1]);
	},
	Statement(node: Node) {
		return evaluate(node.children[0]);
	},
	ExpressionStatement(node: Node) {
		return evaluate(node.children[0]);
	},
	IfStatement(node: Node) {
		const condition = evaluate(node.children[2]);
		const size = node.children.length;
		if (size === 5) {
			if (condition) {
				return evaluate(node.children[4]);
			}
		} else {
			if (condition) {
				return evaluate(node.children[4]);
			} else {
				return evaluate(node.children[6]);
			}
		}
	},
	ForStatement(node: Node) {
		let declarator = evaluate(node.children[2]);
		const binary = evaluate(node.children[4]);
		const updator = evaluate(node.children[6]);
		while (binary(declarator)) {
			evaluate(node.children[8]);
			updator(declarator);
		}
	},
	BlockStatement(node: Node) {
		if (node.children.length === 2) {
			return;
		}
		const env = new Environment(this.currentEnv());
		this.stack.push(env);
		const res = evaluate(node.children[1]);
		this.stack.pop();
		return res;
	},
	Expression(node: Node) {
		return evaluate(node.children[0]);
	},
	AssignmentExpression(node: Node) {
		if (node.children.length === 1) {
			return evaluate(node.children[0]);
		} else if (node.children.length === 3) {
			const ref = evaluate(node.children[0]);
			const value = evaluate(node.children[2]);
			ref.set(value);
		}
	},
	AdditiveExpression(node: Node) {
		if (node.children.length === 1) {
			return evaluate(node.children[0]);
		} else {
			let left = evaluate(node.children[0]);
			if (left instanceof Reference) {
				left = left.get();
			}
			let right = evaluate(node.children[2]);
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
			return evaluate(node.children[0]);
		} else {
			const left = evaluate(node.children[0]);
			const right = evaluate(node.children[2]);
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
		return evaluate(node.children[0]);
	},
	MemberExpression(node: Node) {
		if (node.children.length === 1) {
			return evaluate(node.children[0]);
		} else if (node.children.length === 3) {
			if (node.children[1].type === ".") {
				const reference = new Reference(
					evaluate(node.children[0]),
					evaluate(node.children[2])
				);
				return reference;
			}
		} else if (node.children.length === 4) {
			if (node.children[1].type === "[") {
				const reference = new Reference(
					evaluate(node.children[0]),
					evaluate(node.children[2])
				);
				return reference;
			}
		}
	},
	PrimaryExpression(node: Node) {
		if (node.children.length === 1) {
			return evaluate(node.children[0]);
		} else if (node.children.length === 3) {
			return evaluate(node.children[1]);
		}
	},
	Literal(node: Node) {
		return evaluate(node.children[0]);
	},
	NumberLiteral(node: Node) {
		// todo calculate number
		return Number((node as any).value);
	},
	BooleanLiteral(node: Node) {
		const bool = (node as any).value;
		if (bool === "true") {
			return true;
		}
		return false;
	},
	Declaration(node: Node) {
		const currentEnv = this.currentEnv();
		if (currentEnv) {
			const name = (node.children[1] as any).value;
			currentEnv.set(name, void 0);
			const ref = evaluate(node.children[1]);
			const value = evaluate(node.children[3]);
			ref.set(name, value);
		}
	},
	Identifier(node: Node) {
		const current = this.currentEnv();
		if (current) {
			const value = current.get((node as any).value);
			const reference = new Reference(current, value);
			return reference;
		}
		return undefined;
	},
};

export default evaluate;