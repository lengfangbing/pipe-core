import { BasedValueType, PipeConfigWithCoreFunc, PipeValueConfigType, PipeValueType } from './types';
export default function createPipe<Value extends BasedValueType, Config extends PipeValueConfigType>(value: Value, pipeFuncConfig: Config): Omit<PipeValueType<Value, PipeConfigWithCoreFunc<Value, Config>, () => BasedValueType>, "pipeEnd">;
