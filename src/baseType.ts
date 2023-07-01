import Environment from './Environment';
import { Evaluator, Node, NodeTypes } from './evaluate';
interface DataProperty {
  value: any;
  writable: boolean;
  enumerable: boolean;
  configurable: boolean;
}
interface AccessorProperty {
	get: any;
	set: any;
	enumerable: boolean;
	configurable: boolean;
}
export class JSObject {
	properties = new Map<string, DataProperty | AccessorProperty>();
  prototype: JSObject | null = null;
	constructor() {}

  getProperty(key: string): any {
    const v = this.properties.get(key);
    if (v) {
      return "value" in v ? v.value : undefined;
    } else if (this.prototype !== null) {
      return this.prototype.getProperty(key);
    }
    return undefined;
  }
  setProperty(key: string, value: any) {
    this.properties.set(key, {
      value,
      writable: true,
      enumerable: true,
      configurable: true,
    });
  }
}

interface JSFunctionInterface {
	call: (...args: any[]) => unknown;
	construct: (...args: any[]) => unknown;
}

export class JSFunction extends JSObject implements JSFunctionInterface {
	functionBody: Node;
	evaluator: Evaluator;
	env: Environment;
	parameters: string[] = [];
	constructor(
		functionBody: Node,
		evaluator: Evaluator,
		env: Environment,
		parameters: string[]
	) {
		super();
		this.functionBody = functionBody;
		this.evaluator = evaluator;
		this.env = env;
		this.parameters = parameters;
	}
	call(that: JSObject, args: any[]) {
		// todo 增加 that 到 env 中
		const currentEnv = new Environment(this.env);
		this.parameters.forEach((p, i) => {
			currentEnv.set(p, args[i]);
		});
		this.evaluator.envStack.push(this.env);
		const type = (this.functionBody as any).type as Exclude<
			NodeTypes,
			| "envStack"
			| "currentEnv"
			| "microTaskQueue"
			| "runTask"
			| "preProcessor"
		>;
		const res = this.evaluator[type](this.functionBody as any);
		this.evaluator.envStack.pop();
		return res;
	}
	construct(func: JSFunction, args: any[]) {
		const obj = new JSObject();
		const res = this.call(obj, args);
		if (res instanceof JSObject) {
			return res;
		}
		return obj;
	}
}

// export class PromiseFunction implements JSFunctionInterface {
// 	call() {
// 		throw Error("PromiseFunction can not be called");
// 	}
// 	construct(func: JSFunction, args: any[]) {
// 		const obj = new JSObject();
// 		const then = new ThenFunction();
// 		const resolve = new ResolveFunction(then, this.evaluator);
// 		func.call(resolve, args);
// 		obj.setProperty("then", then);
// 		return obj;
// 	}
// }

// class Task {
// 	func: JSFunction;
// 	args: any;
// 	constructor(args: any, func: JSFunction) {
// 		this.args = args;
// 		this.func = func;
// 	}
// 	run() {
// 		this.func.call(this.func, this.args);
// 	}
// }

// class ResolveFunction implements JSFunctionInterface {
// 	then: ThenFunction;
// 	constructor(then: ThenFunction, evaluate: Evaluator) {
// 		this.then = then;
// 		this.evaluator = evaluate;
// 	}
// 	call(v: any) {
// 		this.evaluator.microTaskQueue.push(new Task(v, this.then));
// 	}
// }

// class ThenFunction implements JSFunctionInterface {
// 	call(func: JSFunction) {}
// }