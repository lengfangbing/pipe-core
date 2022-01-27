declare type BasedValueType = Record<string, any>;
declare type PipeFuncType<GetValue = any, ReturnValue = any> = (value: GetValue) => (ReturnValue | Promise<ReturnValue>);
declare type PipeValueConfigType<GetValue = any, ReturnValue = any> = Record<string, PipeFuncType<GetValue, ReturnValue>>;
declare type Await<T> = T extends PromiseLike<infer U> ? U : T;
declare type PipeStartConfigType<Value extends BasedValueType, Config extends PipeValueConfigType> = {
    pipeStart(): PipeValueType<Value, Config>;
};
declare type PipeEndConfigType = {
    pipeEnd(): Promise<void>;
};
declare type CustomValueParamTypeAlias<BaseReturnType extends (...args: any) => any> = Await<ReturnType<BaseReturnType>>;
declare type ProcessFuncTypeAlias<CoreValue extends BasedValueType, Config extends PipeValueConfigType, LastFunction extends (...args: any) => any> = Omit<PipeValueType<CoreValue, Config, LastFunction>, 'pipeEnd' | 'pipeStart'> & PipeEndConfigType;
declare type ProcessFuncType<CoreValue extends BasedValueType, Config extends PipeValueConfigType, BaseReturnType extends (...args: any) => any, LastFunction extends (...args: any) => any> = (custom?: (value: CustomValueParamTypeAlias<BaseReturnType>, replaceValue: (value: Partial<CoreValue>) => void) => any) => ProcessFuncTypeAlias<CoreValue, Config, LastFunction>;
declare type PipeValueType<CoreValue extends BasedValueType, Config extends PipeValueConfigType, LastFunction extends (...args: any) => any = () => BasedValueType> = {
    [key in keyof Config]: ProcessFuncType<CoreValue, Config, Config[key], LastFunction>;
};
declare type PipeConfigWithCoreFunc<Value extends BasedValueType, Config extends PipeValueConfigType> = Config & PipeStartConfigType<Value, Config> & PipeEndConfigType;

declare function createPipe<Value extends BasedValueType, Config extends PipeValueConfigType<Value>>(value: Value, pipeFuncConfig: Config): Omit<PipeValueType<Value, PipeConfigWithCoreFunc<Value, Config>, () => BasedValueType>, "pipeEnd">;

export { createPipe as default };
