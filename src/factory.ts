import { Action, CustomStartConfig } from './types';

export class PipeValueFactory<Value extends Record<string, any>> {
  // value source
  private value = {} as Value
  // custom functions
  private actionList: Array<Action> = [];
  // 保存方法返回值的Map
  returnValueMap: Map<(...args: any) => any, any> = new Map();
  // extend functions
  private extendFunctions: Array<CustomStartConfig<Value>[string]> = [];
  // just for temp once extend functions
  private extendOnceFunctions: Array<CustomStartConfig<Value>[string]> = [];

  constructor (value: Value) {
    this.value = value;
  }

  getValue () {
    return this.value;
  }

  setValue (value: Partial<Value>) {
    this.value = {
      ...this.value,
      ...value
    };
  }

  clearActionList () {
    this.actionList = [];
  }

  private findActionValueForEachList (
    actionValue: Action['value'],
    list: Array<Action>
  ): Action | void {
    for (const action of list) {
      if (actionValue === action.value) {
        return action;
      }
      if (action.list && action.list.length > 0) {
        const loopAction = this.findActionValueForEachList(actionValue, action.list);
        if (loopAction) {
          return loopAction;
        }
      }
    }
  }

  // 在Action的list中添加一项Action
  appendActionItemByActionValue (action: Action, actionValue: Action['value']) {
    const findActionValue = this.findActionValueForEachList(actionValue, this.actionList);
    if (findActionValue) {
      const newList = findActionValue.list || [];
      newList.push(action);
      findActionValue.list = newList;
    } else {
      // 如果没找到，就直接加到actionList最后
      this.actionList.push(action);
    }
  }

  appendAction (action: Action) {
    this.actionList.push(action);
  }

  async forEachActionList (list: Array<Action>) {
    // 遍历一个Action列表，如果有list存在，那么在执行完value后直接执行list方法，按照此规则递归遍历
    for (const action of list) {
      await action.value();
      if (action.list && action.list.length > 0) {
        await this.forEachActionList(action.list);
      }
    }
  }

  async callActionListValue () {
    // 执行完后进行清空actionList
    await this.forEachActionList(this.actionList);
  }

  saveReturnValue (custom: (...args: any) => any, returnValue: any) {
    this.returnValueMap.set(custom, returnValue);
  }

  getReturnValue (custom: (...args: any) => any) {
    return this.returnValueMap.get(custom);
  }

  static createPipeValue<Value extends object> (value: Value) {
    return new PipeValueFactory<Value>(value);
  }
}
