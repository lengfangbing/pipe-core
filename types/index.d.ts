declare type Await<T> = T extends PromiseLike<infer U> ? U : T;
declare type ReturnTypeAlias<Function extends (...args: any) => any> = Await<ReturnType<Function>>;
declare type PipeEnd<Value> = {
    pipeEnd: () => Promise<Value>;
};
declare type CustomStartFunctionValue<Value> = Record<string, (value: Value) => any>;
declare type PipeFunction<Value, Config extends CustomStartFunctionValue<Value>> = <ParamValue = any>(custom: (paramValue: ParamValue, update: (val: Partial<Value>) => Promise<void> | void) => any) => {
    pipe: PipeFunction<Value, Config>;
} & PipeEnd<Value> & CustomStartFunction<Value, Config>;
declare type CustomStartFunction<Value, Config extends CustomStartFunctionValue<Value>> = {
    [key in keyof Config]: (custom: (val: ReturnTypeAlias<Config[key]>, update: (val: Partial<Value>) => Promise<void> | void) => any) => {
        pipe: PipeFunction<Value, Config>;
    } & CustomStartFunction<Value, Config> & PipeEnd<Value>;
};
declare type PipeCore<Value, Config extends CustomStartFunctionValue<Value>> = CustomStartFunction<Value, Config>;

declare function createPipeCore<Value extends object, CustomStart extends CustomStartFunctionValue<Value>>(value: Value, config?: CustomStart): PipeCore<Value, CustomStart>;

export { createPipeCore };
