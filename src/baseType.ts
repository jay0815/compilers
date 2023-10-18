import Environment from './Environment';
import { Evaluator, Node, NodeTypes } from './evaluate';
// import evaluate from './evaluate';
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
	construct?: (...args: any[]) => unknown;
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
	call(that: JSObject | undefined, args: any[]) {
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
// 	evaluator: Evaluator;
// 	constructor(evaluate: Evaluator) {
// 		this.evaluator = evaluate;
// 	}
// 	call() {
// 		throw Error("PromiseFunction can not be called");
// 	}
// 	construct(func: JSFunction, args: any[]) {
// 		const obj = new JSObject();
// 		const resolve = new ResolveFunction(this.evaluator, obj);
// 		const then = new ThenFunction(resolve, obj);
// 		func.call(void 0, [resolve]);
// 		obj.setProperty("then", then);
// 		return obj;
// 	}
// }
// class ThenFunction implements JSFunctionInterface {
// 	resolve: ResolveFunction;
// 	constructor(resolve: ResolveFunction, obj: JSObject) {
// 		this.resolve = resolve;
// 	}
// 	call(func: ThenFunction, args: any[]) {
// 		this.resolve.then = func;
// 	}
// }
// class Task {
// 	func: ThenFunction | null;
// 	args: any;
// 	constructor(args: any, func: ThenFunction) {
// 		this.args = args;
// 		this.func = func;
// 	}
// 	run() {
// 		if (this.func){
// 			this.func.call();
// 		}
// 	}
// }

// class ResolveFunction implements JSFunctionInterface {
// 	then: ThenFunction | null;
// 	evaluator: Evaluator;
// 	promise: JSObject;
// 	constructor(evaluate: Evaluator, obj: JSObject) {
// 		this.then = null;
// 		this.evaluator = evaluate;
// 		this.promise = obj;
// 	}
// 	call(v: any) {
// 		this.evaluator.microTaskQueue.push(new Task(v, this.then));
// 		this.promise.setProperty("status", "resolved");; 
// 	}
// }

