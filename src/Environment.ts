import { Identifier } from './js-lexical';
class Environment {
	variables = new Map<string, any>();
	// scope chain
	parent: Environment | null = null;
	constructor(parent?: Environment) {
		this.parent = parent || null;
	}

	identifier(name: string) {
		this.variables.set(name, void 0);
	}

	set(name: string, value: any) {
		// 当前环境中有该变量 或者 当前环境没有父环境
		// 则在当前环境中设置该变量
		if (this.variables.has(name) || !this.parent) {
			this.variables.set(name, value);
		} else {
			// 否则在父环境中设置该变量
			this.parent.set(name, value);
		}
	}

	get(name: string): any {
		if (this.variables.has(name) || !this.parent) {
			return this.variables.get(name);
		} else {
			return this.parent.get(name);
		}
	}
}

export default Environment;
