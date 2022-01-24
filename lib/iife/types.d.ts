export declare type BasedValueType = Record<string, any>;
export declare type PipeFuncType<GetValue = any, ReturnValue = any> = (value: GetValue) => (ReturnValue | Promise<ReturnValue>);
export declare type PipeValueConfigType<GetValue = any, ReturnValue = any> = Record<string, PipeFuncType<GetValue, ReturnValue>>;
declare type Await<T> = T extends PromiseLike<infer U> ? U : T;
export declare type ProcessFuncType<CoreValue extends BasedValueType, Config extends PipeValueConfigType, BaseReturnType extends (...args: any) => any, LastFunction extends (...args: any) => any> = (custom?: (value: Await<ReturnType<BaseReturnType>>, replaceValue: (value: Partial<CoreValue>) => void) => any) => Omit<PipeValueType<CoreValue, Config, LastFunction>, 'pipeEnd' | 'pipeStart'> & {
    pipeEnd(): Promise<void>;
};
export declare type PipeValueType<CoreValue extends BasedValueType, Config extends PipeValueConfigType, LastFunction extends (...args: any) => any = () => BasedValueType> = {
    [key in keyof Config]: ProcessFuncType<CoreValue, Config, Config[key], LastFunction>;
};
export declare type PipeConfigWithCoreFunc<Value extends BasedValueType, Config extends PipeValueConfigType> = Config & {
    pipeStart(): PipeValueType<Value, Config>;
    pipeEnd(): Promise<void>;
};
export {};