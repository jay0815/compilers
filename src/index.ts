import getClosureState, { ClosureState, NormalState } from "./closure";

interface Expression {
	value?: string;
	type: string;
}

export type Token =
	| Expression
	| {
			type: string;
			children: Token[];
	  };

const genAst = (
	initState: ClosureState,
	Grammar: Map<string, string[][]>,
	list: Expression[]
) => {
	const state = initState;

	const tokens: Token[] = [];
	const states = [initState];
	getClosureState(state, Grammar);
	const n = list.length;

	const getCurrentState = () => {
		const last = states.length - 1;
		return states[last] as NormalState;
	};

	const shift = (token: Expression) => {
		// 当前 symbol 不被当前状态接受，当symbol 前有回车 或者 symbol 后有特定 symbol, 此时可以插入 ;
		let currentState = getCurrentState();
		// EOF 作为输入符号，用于表示输入结束
		// 在 shift 中做处理
		// 因为 EOF 不满足任何产生式规则，所以会一直 reduce 至 Expression
		while (!currentState[token.type] && currentState.$reduce) {
			reduce();
			currentState = getCurrentState();
		}
		if (!currentState[token.type]) {
			// ASI
			if (
				token.type === "EOF" ||
				token.type === "}" ||
				haveLineTerminator
			) {
				shift({
					type: ";",
					value: ";",
				});
				shift(token);
				return;
			}
			throw Error("syntax error");
		}
		// 将当前输入符号压入栈中，并转移到下一个状态
		tokens.push(token);
		const nextState = currentState[token.type];
		states.push(nextState);
	};

	const reduce = () => {
		// 将栈顶的若干个符号弹出，这些符号构成一个产生式的右侧部分。
		const currentState = getCurrentState();
		if (currentState) {
			const { target, count } = currentState.$reduce;
			const currentToken: Token = {
				type: target,
				children: [],
			};
			for (let i = 0; i < count; i++) {
				states.pop();
				const token = tokens.pop();
				if (token) {
					// 将产生式的左侧部分作为新的符号压入栈中
					// 保证顺序
					currentToken.children.unshift(token);
				}
			}
			shift(currentToken);
		} else {
			throw Error("syntax error");
		}
	};
	// 根据 EOF 进行规约
	// 当前token前是否是回车状态
	let haveLineTerminator = false;
	for (let i = 0; i < n; i++) {
		const token = list[i];
		if (token.type === "LineTerminator") {
			haveLineTerminator = true;
		} else {
			shift(token);
			haveLineTerminator = false;
		}
	}
	// 移除 EOF
	tokens.pop();
	return tokens;
};

export default genAst;
