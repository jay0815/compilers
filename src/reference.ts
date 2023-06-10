import Environment from "./Environment";

class Reference {
	object: Environment;
	property: string;
	constructor(object: Environment, property: string) {
		this.object = object;
		this.property = property;
	}

	set(value: any) {
		this.object.set(this.property, value);
	}

	get() {
		return this.object.get(this.property);
	}
}


export default  Reference;
