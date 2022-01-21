// 基本的value类型
export type BasedValueType = Record<string, any>;

// pipe的每一项方法类型, 这个方法只会将value处理一次后, 返回一个新的value, 这个value不会替换掉之前的value, 而是当做下一个方法的参数
export type PipeFuncType<GetValue = any, ReturnValue = any> = (value: GetValue) => (ReturnValue | Promise<ReturnValue>);

// 创建pipe时的方法配置
export type PipeValueConfigType<GetValue = any, ReturnValue = any> = Record<string, PipeFuncType<GetValue, ReturnValue>>;

type Await<T> = T extends PromiseLike<infer U> ? U : T;

// 处理后的方法的类型
export type ProcessFuncType<
	Config extends PipeValueConfigType,
	BaseReturnType extends (...args: any) => any,
	LastFunction extends (...args: any) => any
	> = (
	custom?: (value: Await<ReturnType<BaseReturnType>>, replaceValue: (value: BasedValueType) => void) => (unknown | Promise<unknown>),
) => PipeValueType<Config, LastFunction>;

// 创建出来的value的类型
export type PipeValueType<Config extends PipeValueConfigType, LastFunction extends (...args: any) => any = () => BasedValueType> = {
	[key in keyof Config]: ProcessFuncType<Config, Config[key], LastFunction>;
};
