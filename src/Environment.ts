class Environment {
	variables = new Map<string, any>();
	parent: Environment | null = null;
	constructor(parent?: Environment) {
		this.parent = parent || null;
	}
	set(name: string, value: any) {
		if (this.variables.has(name) || !this.parent) {
			this.variables.set(name, value);
		} else {
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