import { PipeValueFactory } from './factory';
import {
  CustomStartConfigFunctions,
  CustomStartConfig,
  PipeCore,
  PipeEnd,
  PipeFunction,
  CustomFunction
} from './types';

export * from './types';

/**
 * @TODO 增加对调用其他pipe管道的方法实现，新的数据结构设计完成，只需要将调用其他管道方法append到list中即可
 */

// 创建传入的start方法
function createCustomStartFunction<Value extends object, CustomStart extends CustomStartConfig<Value>> (
  valueFactory: PipeValueFactory<Value>,
  {
    config
  }: {
    config: CustomStart
  }
): CustomStartConfigFunctions<Value, CustomStart> {
  // 对customStart方法的转换
  const formattedCustomStart = {} as CustomStartConfigFunctions<Value, CustomStart>;
  // 遍历config对象，定义新的方法
  for (const [key, value] of Object.entries(config)) {
    formattedCustomStart[key as keyof CustomStartConfigFunctions<Value, CustomStart>] = (
      custom: CustomFunction<Value, CustomStart>
    ) => {
      // 把执行方法添加到execFunction中
      const customFunction = async () => {
        // 获取到value方法的返回值，要当做新的方法的参数执行
        const returnValue = await value(valueFactory.getValue());
        // 执行传入的custom方法
        // 拿到返回值的实现 并保存起来，暂定实现为单独定义改customFunction然后
        const tempReturnValue = await custom(returnValue, valueFactory.setValue.bind(valueFactory));
        // 将{customFunction: customReturnValue}存到Map中，把customFunction传到下一级中用Map取值
        valueFactory.saveReturnValue(customFunction, tempReturnValue);
      };
      valueFactory.appendAction({
        value: customFunction
      });
      return {
        ...createPipeEnd(valueFactory),
        ...createCustomStartFunction(valueFactory, { config }),
        ...createPipe(valueFactory, {
          config,
          customFunctionInMap: customFunction
        })
      };
    };
  }

  return formattedCustomStart;
}

// 创建pipe方法
function createPipe<Value extends object, CustomStart extends CustomStartConfig<Value>> (
  valueFactory: PipeValueFactory<Value>,
  {
    config,
    customFunctionInMap
  }: {
    config: CustomStart;
    customFunctionInMap: (...args: any) => any;
  }
): { pipe: PipeFunction<Value, CustomStart>; } {
  return {
    pipe (custom: CustomFunction<Value, CustomStart>) {
      const customFunction = async () => {
        // 拿到返回值
        const returnValue = valueFactory.getReturnValue(customFunctionInMap);
        // 执行传入的custom方法
        // 拿到返回值
        const tempReturnValue = await custom(returnValue, valueFactory.setValue.bind(valueFactory));
        // 将{customFunction: customReturnValue}存到Map中，把customFunction传到下一级中用Map取值
        valueFactory.saveReturnValue(customFunction, tempReturnValue);
      };
      valueFactory.appendAction({
        value: customFunction
      });
      return {
        ...createPipe(valueFactory, {
          config,
          customFunctionInMap: customFunction
        }),
        ...createPipeEnd(valueFactory),
        ...createCustomStartFunction(valueFactory, { config })
      };
    },
    ...createPipeEnd(valueFactory),
    ...createCustomStartFunction(valueFactory, { config })
  };
}

// 创建pipeEnd方法
function createPipeEnd<Value extends object> (
  valueFactory: PipeValueFactory<Value>
): PipeEnd<Value> {
  return {
    async pipeEnd () {
      // 顺序执行方法
      await valueFactory.callActionListValue();
      // 清空方法
      valueFactory.clearActionList();
      // 返回最后的value值
      return Promise.resolve(valueFactory.getValue());
    }
  };
}

export function createPipeCore<Value extends object, CustomStart extends CustomStartConfig<Value>> (
  value: Value,
  config = {} as CustomStart
): PipeCore<Value, CustomStart> {
  const _value = PipeValueFactory.createPipeValue(value);
  return createCustomStartFunction(_value, { config });
}
