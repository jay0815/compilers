import type { ClosureState } from "./closure";

export const genGrammar = (grammar: [string, string[][]][]) => {
	const map = new Map(grammar);
	return map;
};
export const genInitState = (state: any) => {
	return state as ClosureState;
};
