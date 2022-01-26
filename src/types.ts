// 基本的value类型
export type BasedValueType = Record<string, any>;

// pipe的每一项方法类型, 这个方法只会将value处理一次后, 返回一个新的value, 这个value不会替换掉之前的value, 而是当做下一个方法的参数
export type PipeFuncType<GetValue = any, ReturnValue = any> = (value: GetValue) => (ReturnValue | Promise<ReturnValue>);

// 创建pipe时的方法配置
export type PipeValueConfigType<GetValue = any, ReturnValue = any> = Record<string, PipeFuncType<GetValue, ReturnValue>>;

type Await<T> = T extends PromiseLike<infer U> ? U : T;

type PipeStartConfigType<Value extends BasedValueType, Config extends PipeValueConfigType> = {
	pipeStart(): PipeValueType<Value, Config>;
};

type PipeEndConfigType = {
	pipeEnd(): Promise<void>;
};

// 简写的custom方法的value参数类型
export type CustomValueParamTypeAlias<BaseReturnType extends (...args: any) => any> = Await<ReturnType<BaseReturnType>>

// 简写的过程方法类型
export type ProcessFuncTypeAlias<
	CoreValue extends BasedValueType,
	Config extends PipeValueConfigType,
	LastFunction extends (...args: any) => any
	> = Omit<PipeValueType<CoreValue, Config, LastFunction>, 'pipeEnd' | 'pipeStart'> & PipeEndConfigType;

// 处理后的方法的类型
export type ProcessFuncType<
	CoreValue extends BasedValueType,
	Config extends PipeValueConfigType,
	BaseReturnType extends (...args: any) => any,
	LastFunction extends (...args: any) => any
	> = (
	custom?: (value: CustomValueParamTypeAlias<BaseReturnType>, replaceValue: (value: Partial<CoreValue>) => void) => any,
	// 把pipeStart类型剔除，并修改pipeEnd的类型
) => ProcessFuncTypeAlias<CoreValue, Config, LastFunction>;


// 创建出来的value的类型
export type PipeValueType<
	CoreValue extends BasedValueType,
	Config extends PipeValueConfigType,
	LastFunction extends (...args: any) => any = () => BasedValueType
	> = {
	[key in keyof Config]: ProcessFuncType<CoreValue, Config, Config[key], LastFunction>;
};

// 简写的配置项
export type PipeConfigWithCoreFunc<Value extends BasedValueType, Config extends PipeValueConfigType> = Config & PipeStartConfigType<Value, Config> & PipeEndConfigType;
