/* eslint-disable no-use-before-define */
type Await<T> = T extends PromiseLike<infer U> ? U : T;
// 方法返回值的简写方法
export type ReturnTypeAlias<Function extends (...args: any) => any> = Await<ReturnType<Function>>;

// valueFactory的action
export type Action = {
  value: () => void | Promise<void>;
  list?: Array<Action>;
};

// 传参的config方法类型，不是运行中的config方法类型
export type CustomStartConfig<Value> = Record<string, (value: Value) => any>;

export type CustomFunction<Value, Config extends CustomStartConfig<Value>, ParamValue = any> = (
  paramValue: ParamValue,
  piecePipe: PiecePipeCore<Value, Config>,
  update: (val: Partial<Value>) => Promise<void> | void
) => any;

export type PipeEnd<Value> = {
  pipeEnd: () => Promise<Value>;
};

// pipe config
export type PipeConfigFunction<Value, Config extends CustomStartConfig<Value>> = {
  pipe: PipeFunction<Value, Config>;
};

// 运行中的pipe方法
export type PipeFunction<Value, Config extends CustomStartConfig<Value>> = <ParamValue = any>(
  custom: CustomFunction<Value, Config, ParamValue>,
) => PipeConfigFunction<Value, Config> & PipeEnd<Value> & CustomStartConfigFunctions<Value, Config>;

// 运行中的Config方法的类型
export type CustomStartConfigFunctions<Value, Config extends CustomStartConfig<Value>> = {
  [key in keyof Config]: (
    custom: CustomFunction<Value, Config, ReturnTypeAlias<Config[key]>>,
  ) => PipeConfigFunction<Value, Config> & CustomStartConfigFunctions<Value, Config> & PipeEnd<Value>;
};

// 主流程的PipeCore调用方法
export type PipeCoreConfig<Value, Config extends CustomStartConfig<Value>> =
  CustomStartConfigFunctions<Value, Config> & PipeEnd<Value>;

// pipe config
export type OtherPipeConfigFunction<Value, Config extends CustomStartConfig<Value>> = {
  pipe: OtherPipeFunction<Value, Config>;
};

// 子流程的运行中的pipe方法
export type OtherPipeFunction<Value, Config extends CustomStartConfig<Value>> = <ParamValue = any>(
  custom: CustomFunction<Value, Config, ParamValue>,
) => OtherPipeConfigFunction<Value, Config> & OtherCustomStartConfigFunctions<Value, Config>;

// 子流程的运行中的Config方法的类型
export type OtherCustomStartConfigFunctions<Value, Config extends CustomStartConfig<Value>> = {
  [key in keyof Config]: (
    custom: CustomFunction<Value, Config, ReturnTypeAlias<Config[key]>>,
  ) => OtherPipeConfigFunction<Value, Config> & OtherCustomStartConfigFunctions<Value, Config>;
};

// 子流程的PipeCore调用方法
export type OtherPipeCoreConfig<Value, Config extends CustomStartConfig<Value>> =
  OtherCustomStartConfigFunctions<Value, Config>;

export type PiecePipeCore<Value, Config extends CustomStartConfig<Value>> = OtherPipeCoreConfig<Value, Config>;

export type PipeCore<Value, Config extends CustomStartConfig<Value>> = PipeCoreConfig<Value, Config>;
