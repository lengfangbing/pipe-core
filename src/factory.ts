import { CustomStartFunctionValue } from './types';

export class PipeValueFactory<Value extends Record<string, any>> {
  // value source
  value = {} as Value
  // custom functions
  execFunctions: Array<(...args: any) => any> = [];
  // 保存方法返回值的Map
  returnValueMap: Map<(...args: any) => any, any> = new Map();
  // extend functions
  extendFunctions: Array<CustomStartFunctionValue<Value>[string]> = [];
  // just for temp once extend functions
  extendOnceFunctions: Array<CustomStartFunctionValue<Value>[string]> = [];

  constructor (value: Value) {
    this.value = value;
  }

  getValue () {
    return this.value;
  }

  setValue (value: Partial<Value>) {
    this.value = {
      ...this.value,
      ...value
    };
  }

  clearExec () {
    this.execFunctions = [];
  }

  appendExecFunction (func: (...args: any) => any) {
    this.execFunctions.push(func);
  }

  startRecordFunction () {
    this.clearExec();
  }

  async execFunction () {
    for (const func of this.execFunctions) {
      await func();
    }
    this.clearExec();
  }

  saveReturnValue (custom: (...args: any) => any, returnValue: any) {
    this.returnValueMap.set(custom, returnValue);
  }

  getReturnValue (custom: (...args: any) => any) {
    return this.returnValueMap.get(custom);
  }

  static createPipeValue<Value extends object> (value: Value) {
    return new PipeValueFactory<Value>(value);
  }
}
