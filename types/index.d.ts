declare type Await<T> = T extends PromiseLike<infer U> ? U : T;
declare type ReturnTypeAlias<Function extends (...args: any) => any> = Await<ReturnType<Function>>;
declare type Action = {
    value: () => void | Promise<void>;
    list?: Array<Action>;
};
declare type CustomStartConfig<Value> = Record<string, (value: Value) => any>;
declare type CustomFunction<Value, Config extends CustomStartConfig<Value>, ParamValue = any> = (paramValue: ParamValue, piecePipe: PiecePipeCore<Value, Config>, update: (val: Partial<Value>) => Promise<void> | void) => any;
declare type PipeEnd<Value> = {
    pipeEnd: () => Promise<Value>;
};
declare type PipeConfigFunction<Value, Config extends CustomStartConfig<Value>> = {
    pipe: PipeFunction<Value, Config>;
};
declare type PipeFunction<Value, Config extends CustomStartConfig<Value>> = <ParamValue = any>(custom: CustomFunction<Value, Config, ParamValue>) => PipeConfigFunction<Value, Config> & PipeEnd<Value> & CustomStartConfigFunctions<Value, Config>;
declare type CustomStartConfigFunctions<Value, Config extends CustomStartConfig<Value>> = {
    [key in keyof Config]: (custom: CustomFunction<Value, Config, ReturnTypeAlias<Config[key]>>) => PipeConfigFunction<Value, Config> & CustomStartConfigFunctions<Value, Config> & PipeEnd<Value>;
};
declare type PipeCoreConfig<Value, Config extends CustomStartConfig<Value>> = CustomStartConfigFunctions<Value, Config> & PipeEnd<Value>;
declare type OtherPipeConfigFunction<Value, Config extends CustomStartConfig<Value>> = {
    pipe: OtherPipeFunction<Value, Config>;
};
declare type OtherPipeFunction<Value, Config extends CustomStartConfig<Value>> = <ParamValue = any>(custom: CustomFunction<Value, Config, ParamValue>) => OtherPipeConfigFunction<Value, Config> & OtherCustomStartConfigFunctions<Value, Config>;
declare type OtherCustomStartConfigFunctions<Value, Config extends CustomStartConfig<Value>> = {
    [key in keyof Config]: (custom: CustomFunction<Value, Config, ReturnTypeAlias<Config[key]>>) => OtherPipeConfigFunction<Value, Config> & OtherCustomStartConfigFunctions<Value, Config>;
};
declare type OtherPipeCoreConfig<Value, Config extends CustomStartConfig<Value>> = OtherCustomStartConfigFunctions<Value, Config>;
declare type PiecePipeCore<Value, Config extends CustomStartConfig<Value>> = OtherPipeCoreConfig<Value, Config>;
declare type PipeCore<Value, Config extends CustomStartConfig<Value>> = PipeCoreConfig<Value, Config>;

declare function createPipeCore<Value extends object, CustomStart extends CustomStartConfig<Value>>(value: Value, config?: CustomStart): PipeCore<Value, CustomStart>;

export { Action, CustomFunction, CustomStartConfig, CustomStartConfigFunctions, OtherCustomStartConfigFunctions, OtherPipeConfigFunction, OtherPipeCoreConfig, OtherPipeFunction, PiecePipeCore, PipeConfigFunction, PipeCore, PipeCoreConfig, PipeEnd, PipeFunction, ReturnTypeAlias, createPipeCore };
