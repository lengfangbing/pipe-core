declare type BasedValueType = Record<string, any>;
declare type PipeConfigType<CoreValue = any> = Record<string, (val: CoreValue) => any>;
declare type Await<T> = T extends PromiseLike<infer U> ? U : T;
declare type ReturnTypeAlias<Function extends (...args: any) => any> = Await<ReturnType<Function>>;
declare type PipeEndAliasType = {
    pipeEnd(): Promise<void>;
};
declare type PipeAliasType<CoreValue extends BasedValueType, Config extends PipeConfigType<CoreValue>> = {
    pipe<ValueType = any>(custom: (val: ValueType, update: (val: Partial<CoreValue>) => void) => any): PipeAliasType<CoreValue, Config> & ProcessConfigType<CoreValue, Config> & PipeEndAliasType;
};
declare type ProcessConfigType<CoreValue extends BasedValueType, Config extends PipeConfigType<CoreValue>> = {
    [key in keyof Config]: (custom: (val: ReturnTypeAlias<Config[key]>, update: (val: Partial<CoreValue>) => void) => any) => PipeEndAliasType & PipeAliasType<CoreValue, Config>;
};

declare function createPipeCore<Value extends BasedValueType, Config extends PipeConfigType<Value>>(value: Value, pipeFuncConfig: Config): {
    pipeStart: () => ProcessConfigType<Value, Config> & PipeEndAliasType;
};

export { createPipeCore as default };
