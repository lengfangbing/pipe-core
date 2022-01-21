import { BasedValueType, PipeValueConfigType, PipeValueType } from './types';

class CoreValueFactory {
	coreValue: BasedValueType;
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
	
	appendFunc(func: (...args: any) => any) {
		this.funcArray.push(func);
	}
	
	initFuncArray() {
		this.funcArray = [];
	}
	
	async execFuncArray() {
		for (const func of this.funcArray) {
			await func.call(null);
		}
		this.initFuncArray();
	}
	
	static createCoreValue(value: BasedValueType) {
		return new CoreValueFactory(value);
	}
}

function createCoreValue<Value extends BasedValueType = BasedValueType>(value: Value) {
	return CoreValueFactory.createCoreValue(value);
}

function createPipeValue<Config extends PipeValueConfigType>(valueFactory: CoreValueFactory, config?: Config): PipeValueType<Config> {
	// 添加默认的pipeStart和pipeEnd
	let pipeValue = {} as PipeValueType<Config>;
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
				await customFunc(tempValue, valueFactory.setValue);
			});
			return pipeValue;
		}
	}

	return pipeValue;
}

export default function createPipe<Value extends BasedValueType, Config extends PipeValueConfigType> (value: Value, pipeFuncConfig: Config) {
	const coreValue = createCoreValue(value);
	return createPipeValue(coreValue, pipeFuncConfig);
}
