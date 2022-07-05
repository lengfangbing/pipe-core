/* eslint-disable no-use-before-define */
type Await<T> = T extends PromiseLike<infer U> ? U : T;
// 方法返回值的简写方法
export type ReturnTypeAlias<Function extends (...args: any) => any> = Await<ReturnType<Function>>;

export type PipeEnd<Value> = {
  pipeEnd: () => Promise<Value>;
};

// 传参的config方法类型，不是运行中的config方法类型
export type CustomStartFunctionValue<Value> = Record<string, (value: Value) => any>;

// 运行中的pipe方法
export type PipeFunction<Value, Config extends CustomStartFunctionValue<Value>> = <ParamValue = any>(
  custom: (paramValue: ParamValue, update: (val: Partial<Value>) => Promise<void> | void) => any,
) => {
       pipe: PipeFunction<Value, Config>;
     } & PipeEnd<Value> & CustomStartFunction<Value, Config>;

// 运行中的Config方法的类型
export type CustomStartFunction<Value, Config extends CustomStartFunctionValue<Value>> = {
  [key in keyof Config]: (
    custom: (val: ReturnTypeAlias<Config[key]>, update: (val: Partial<Value>) => Promise<void> | void) => any,
  ) => {
         pipe: PipeFunction<Value, Config>;
       } & PipeEnd<Value>
}

export type PipeStart<Value, Config extends CustomStartFunctionValue<Value>> = {
  pipeStart: () => CustomStartFunction<Value, Config>;
};

export type PipeCore<Value, Config extends CustomStartFunctionValue<Value>> = PipeStart<Value, Config>;
