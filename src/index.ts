import { BasedValueType, PipeConfigWithCoreFunc, PipeValueConfigType, PipeValueType } from './types';

class CoreValueFactory {
	// 理解为value的ref
	coreValue: BasedValueType;
	// functions列表
	funcArray: Array<(...args: any) => any>;
	
	constructor(value: BasedValueType) {
		this.coreValue = value;
		this.funcArray = [];
	}
	
	getValue() {
		return this.coreValue;
	}
	
	setValue(value: BasedValueType) {
		this.coreValue = {
			...this.coreValue,
			...value,
		};
	}
	
	// push一个function
	appendFunc(func: (...args: any) => any) {
		this.funcArray.push(func);
	}
	
	initFuncArray() {
		this.funcArray = [];
	}
	
	// 消费整个functions列表
	async execFuncArray() {
		for (const func of this.funcArray) {
			await func.call(null);
		}
		this.initFuncArray();
	}
	
	// 返回一个value的实例
	static createCoreValue(value: BasedValueType) {
		return new CoreValueFactory(value);
	}
}

function createCoreValue<Value extends BasedValueType = BasedValueType>(value: Value) {
	return CoreValueFactory.createCoreValue(value);
}

function createPipeValue<CoreValue extends BasedValueType, Config extends PipeValueConfigType>(valueFactory: CoreValueFactory, config?: Config): PipeValueType<CoreValue, Config> {
	// 添加默认的pipeStart和pipeEnd
	let pipeValue = {
		pipeStart(): PipeValueType<CoreValue, Config> {
			valueFactory.initFuncArray();
			return pipeValue;
		},
		async pipeEnd(): Promise<void> {
			await valueFactory.execFuncArray();
		},
	} as PipeValueType<CoreValue, PipeConfigWithCoreFunc<CoreValue, Config>>;
	// 空的时候返回空
	if (!config) {
		return pipeValue;
	}
	for (const name in config) {
		const func = config[name];
		pipeValue[name] = customFunc => {
			valueFactory.appendFunc(async () => {
				// 执行config基本的数据操作方法
				const tempValue = await func.call(null, valueFactory.getValue());
				if (customFunc) {
					await customFunc(tempValue, valueFactory.setValue.bind(valueFactory));
				}
			});
			return pipeValue;
		};
	}
	
	return pipeValue;
}

export default function createPipe<Value extends BasedValueType,
	Config extends PipeValueConfigType>(
	value: Value,
	pipeFuncConfig: Config,
): PipeValueType<Value, PipeConfigWithCoreFunc<Value, Config>> {
	const coreValue = createCoreValue(value);
	return createPipeValue(coreValue, pipeFuncConfig as PipeConfigWithCoreFunc<Value, Config>);
}
