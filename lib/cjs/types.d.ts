export declare type BasedValueType = Record<string, any>;
export declare type PipeFuncType<GetValue = any, ReturnValue = any> = (value: GetValue) => (ReturnValue | Promise<ReturnValue>);
export declare type PipeValueConfigType<GetValue = any, ReturnValue = any> = Record<string, PipeFuncType<GetValue, ReturnValue>>;
declare type Await<T> = T extends PromiseLike<infer U> ? U : T;
declare type PipeStartConfigType<Value extends BasedValueType, Config extends PipeValueConfigType> = {
    pipeStart(): PipeValueType<Value, Config>;
};
declare type PipeEndConfigType = {
    pipeEnd(): Promise<void>;
};
export declare type CustomValueParamTypeAlias<BaseReturnType extends (...args: any) => any> = Await<ReturnType<BaseReturnType>>;
export declare type ProcessFuncTypeAlias<CoreValue extends BasedValueType, Config extends PipeValueConfigType, LastFunction extends (...args: any) => any> = Omit<PipeValueType<CoreValue, Config, LastFunction>, 'pipeEnd' | 'pipeStart'> & PipeEndConfigType;
export declare type ProcessFuncType<CoreValue extends BasedValueType, Config extends PipeValueConfigType, BaseReturnType extends (...args: any) => any, LastFunction extends (...args: any) => any> = (custom?: (value: CustomValueParamTypeAlias<BaseReturnType>, replaceValue: (value: Partial<CoreValue>) => void) => any) => ProcessFuncTypeAlias<CoreValue, Config, LastFunction>;
export declare type PipeValueType<CoreValue extends BasedValueType, Config extends PipeValueConfigType, LastFunction extends (...args: any) => any = () => BasedValueType> = {
    [key in keyof Config]: ProcessFuncType<CoreValue, Config, Config[key], LastFunction>;
};
export declare type PipeConfigWithCoreFunc<Value extends BasedValueType, Config extends PipeValueConfigType> = Config & PipeStartConfigType<Value, Config> & PipeEndConfigType;
export {};
