import evaluate from './evaluate';
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

export class JSFunction extends JSObject {
	functionBody: any = {};
	evaluator: Record<string, any>;
	env: any[];
	constructor(functionBody: any[], evaluator: any, env: any[]) {
		super();
		this.functionBody = functionBody;
		this.evaluator = evaluator;
		this.env = env;
	}
	call(that: JSObject) {
    // todo 增加 that 到 env 中
    this.evaluator.envStack.push(this.env);
		const res = this.evaluator[this.functionBody.type](this.functionBody);
    this.evaluator.envStack.pop();
    return res;
	}
	construct() {
    const obj = new JSObject();
    const res = this.call(obj);
    if (res instanceof JSObject) {
      return res;
    }
    return obj;
  }
}

export class PromiseFunction extends JSFunction {
	call() {
		throw Error("PromiseFunction can not be called");
	}
	construct(func: JSFunction) {
		const obj = new JSObject();
    const then = new ThenFunction();
    const resolve = new ResolveFunction(then);
    func.call(resolve);
    obj.setProperty("then", then);
    return obj;
	}
}

class Task {
	constructor(args: any, func: JSFunction) {
    this.args = args;
    this.func = func;
  }
  run() {
  }
}

class ResolveFunction extends JSFunction {
	then: ThenFunction | null = null;
	constructor(then: ThenFunction) {
		super([], {}, []);
		this.then = then;
	}
	call(v: any) {
    this.evaluator.microTaskQueue.push();
  }
}

class ThenFunction extends JSFunction {
	call(func: JSFunction) {}
}