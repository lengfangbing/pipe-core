/* eslint-disable no-use-before-define */
// 基本的value类型
export type BasedValueType = Record<string, any>;

// 创建pipe的config的类型
export type PipeConfigType<CoreValue = any> = Record<string, (val: CoreValue) => any>;

// 获取Promise方法的返回值
type Await<T> = T extends PromiseLike<infer U> ? U : T;

// 方法返回值的简写方法
export type ReturnTypeAlias<Function extends (...args: any) => any> = Await<ReturnType<Function>>;

// end方法的简写类型
export type PipeEndAliasType = {
  pipeEnd(): Promise<void>;
};

// pipe方法的简写类型
export type PipeAliasType<
  CoreValue extends BasedValueType,
  Config extends PipeConfigType<CoreValue>
  > = {
  pipe<ValueType = any>(custom: (val: ValueType, update: (val: Partial<CoreValue>) => void) => any): PipeAliasType<CoreValue, Config> & ProcessConfigType<CoreValue, Config> & PipeEndAliasType;
};

// 处理中Config变体的方法类型
export type ProcessConfigType<
  CoreValue extends BasedValueType,
  Config extends PipeConfigType<CoreValue>,
  > = {
  // 这里要改成Config的方法
  [key in keyof Config]: (
    custom: (val: ReturnTypeAlias<Config[key]>, update: (val: Partial<CoreValue>) => void) => any
  ) => PipeEndAliasType & PipeAliasType<CoreValue, Config>;
}

// start方法的简写类型
export type PipeStartAliasType<CoreValue extends BasedValueType, Config extends PipeConfigType<CoreValue>> = {
  pipeStart(): ProcessConfigType<CoreValue, Config> & PipeEndAliasType;
}

// 创建出来的类型
export type PipeValueType<
  CoreValue extends BasedValueType,
  Config extends PipeConfigType<CoreValue>
  > = PipeStartAliasType<CoreValue, Config>;
