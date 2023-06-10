import { Token } from "./index";
import Reference from "./reference";
import Environment from "./Environment";

type Node = { type: string; children: Token[] };
type Types = keyof typeof evaluator;

const evaluate = (ast: Token): any => {
	return evaluator[ast.type as Exclude<Types, "envStack" | "currentEnv">](
		ast as any
	);
};

export const globalEnv = new Environment();

const evaluator = {
	envStack: [globalEnv] as Environment[],
	get currentEnv() {
		return this.envStack[this.envStack.length - 1];
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
		const size = node.children.length;
		if (size === 5) {
			const condition = evaluate(node.children[2]);
			if (condition) {
				return evaluate(node.children[4]);
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
					break;
				}
				// 执行 循环体 statementList
				evaluate(node.children[8]);
				// update
				evaluate(node.children[6]);
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
				evaluate(node.children[4]);
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
	RelationalExpression(node: Node) {
		const size = node.children.length;
		if (size === 1) {
			return evaluate(node.children[0]);
		} else if (size === 3) {
			const left = evaluate(node.children[0]);
			const right = evaluate(node.children[2]);
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
	BlockStatement(node: Node) {
		const size = node.children.length;
		if (size === 2) {
			// 空 的 block statement
			return;
		} else if (size === 3) {
			// 创建一个新的 block scope 环境
			this.envStack.push(new Environment(this.currentEnv));
			const res = evaluate(node.children[1]);
			// 恢复 当前层级 环境变量
			this.envStack.pop();
			return res;
		}
	},
	Expression(node: Node) {
		return evaluate(node.children[0]);
	},
	AssignmentExpression(node: Node) {
		const size = node.children.length;
		if (size === 1) {
			return evaluate(node.children[0]);
		} else if (size === 3) {
			if (node.children[1].type === "=") {
				const ref = evaluate(node.children[0]) as Reference;
				const value = evaluate(node.children[2]);
				ref.set(value);
			} else {
				//  AssignmentOperator
				// *= /= %= += -= <<= >>= >>>= &= ^= |= **=
			}
		}
	},
	AdditiveExpression(node: Node) {
		if (node.children.length === 1) {
			return evaluate(node.children[0]);
		} else {
			// 当 left 和 right 都是 number 类型时，直接计算
			// 当 left 和 right 都是 Reference 类型时, 先获取具体值，再计算
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
		// 返回内容不应该是 具体值 而应该是一个 reference
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
			if (node.children[0].type === "MemberExpression") {
				const reference = new Reference(
					evaluate(node.children[0]),
					evaluate(node.children[2])
				);
				return reference;
			}
		}
	},
	NewExpression(node: Node) {
		const size = node.children.length;
		if (size === 1) {
			return evaluate(node.children[0]);
		} else if (size === 2) {
			return evaluate(node.children[1]);
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
	NullLiteral(node: Node) {
		return null;
	},
	StringLiteral(node: Node) {
		// todo convert value to string
		return String((node as any).value);
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
	Declaration(node: Node) {
		const name = (node.children[1] as any).value;
		this.currentEnv.set(name, void 0);
		const ref = evaluate(node.children[1]) as Reference;
		const value = evaluate(node.children[3]);
		ref.set(value);
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

export default evaluate;