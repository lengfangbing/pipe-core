/* eslint-disable no-useless-call */
import { BasedValueType, PipeConfigType, PipeEndAliasType, ProcessConfigType } from './types';

class CoreValueFactory {
  // 理解为value的ref
  coreValue: BasedValueType;
  // functions列表
  funcArray: Array<(...args: any) => any>;

  constructor (value: BasedValueType) {
    this.coreValue = value;
    this.funcArray = [];
  }

  getValue () {
    return this.coreValue;
  }

  setValue (value: BasedValueType) {
    this.coreValue = {
      ...this.coreValue,
      ...value
    };
  }

  // push一个function
  appendFunc (func: (...args: any) => any) {
    this.funcArray.push(func);
  }

  initFuncArray () {
    this.funcArray = [];
  }

  // 消费整个functions列表
  async execFuncArray () {
    for (const func of this.funcArray) {
      await func.call(null);
    }
    this.initFuncArray();
  }

  // 返回一个value的实例
  static createCoreValue (value: BasedValueType) {
    return new CoreValueFactory(value);
  }
}

function createCoreValue<Value extends BasedValueType = BasedValueType> (value: Value) {
  return CoreValueFactory.createCoreValue(value);
}

function createPipeEnd (coreValue: CoreValueFactory) {
  const pipeEnd = async () => {
    await coreValue.execFuncArray();
  };
  return {
    pipeEnd
  };
}

// 待补充config的每一项方法的返回值。可以for...of遍历config后去修改每一项方法的返回的pipe方法，参数为config修改后的返回值
function createPipe<Value extends BasedValueType,
  Config extends PipeConfigType<Value>> (coreValue: CoreValueFactory, pipeFuncConfig: Config) {
  // 创建pipe的逻辑代码, 直接补充pipeEnd方法
  const res = {
    ...createPipeEnd(coreValue)
  } as Record<string, any>;
  for (const [name, func] of Object.entries(pipeFuncConfig)) {
    res[name] = (customFunction: (...args: any) => any) => {
      // 定义config的实现方法
      coreValue.appendFunc(async () => {
        // config的方法的返回值
        const returnValue = await func.call(null, coreValue.getValue() as Value);
        // 实现转化后的config方法
        await customFunction(returnValue, coreValue.setValue);
      });
    };
  }
  return res as ProcessConfigType<Value, Config> & PipeEndAliasType;
}

// 创建pipeStart的方法
function createPipeStart<Value extends BasedValueType,
  Config extends PipeConfigType<Value>> (coreValue: CoreValueFactory, pipeFuncConfig: Config) {
  const pipeStart = () => {
    // 重置执行数组
    coreValue.initFuncArray();
    return createPipe<Value, Config>(coreValue, pipeFuncConfig);
  };
  return {
    pipeStart
  };
}

export default function createPipeCore<Value extends BasedValueType,
  Config extends PipeConfigType<Value>> (
  value: Value,
  pipeFuncConfig: Config
) {
  const coreValue = createCoreValue(value);
  // 把开始的value的pipeEnd剔除掉
  return createPipeStart<Value, Config>(coreValue, pipeFuncConfig);
}
