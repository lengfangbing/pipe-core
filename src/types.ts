/* eslint-disable no-use-before-define */
type Await<T> = T extends PromiseLike<infer U> ? U : T;
// 方法返回值的简写方法
export type ReturnTypeAlias<Function extends (...args: any) => any> = Await<ReturnType<Function>>;

// valueFactory的action
export type Action = {
  value: () => void | Promise<void>;
  list?: Array<Action>;
};

export type CustomFunction<Value, Config extends CustomStartConfig<Value>, ParamValue = any> = (
  paramValue: ParamValue,
  update: (val: Partial<Value>) => Promise<void> | void
) => any;

export type PipeEnd<Value> = {
  pipeEnd: () => Promise<Value>;
};

// 传参的config方法类型，不是运行中的config方法类型
export type CustomStartConfig<Value> = Record<string, (value: Value) => any>;

// 运行中的pipe方法
export type PipeFunction<Value, Config extends CustomStartConfig<Value>> = <ParamValue = any>(
  custom: CustomFunction<Value, Config, ParamValue>,
) => {
       pipe: PipeFunction<Value, Config>;
     } & PipeEnd<Value> & CustomStartConfigFunctions<Value, Config>;

// 运行中的Config方法的类型
export type CustomStartConfigFunctions<Value, Config extends CustomStartConfig<Value>> = {
  [key in keyof Config]: (
    custom: CustomFunction<Value, Config, ReturnTypeAlias<Config[key]>>,
  ) => {
         pipe: PipeFunction<Value, Config>;
       } & CustomStartConfigFunctions<Value, Config> & PipeEnd<Value>
}

export type PipeCore<Value, Config extends CustomStartConfig<Value>> = CustomStartConfigFunctions<Value, Config>;
