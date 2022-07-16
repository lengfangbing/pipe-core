/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

var PipeValueFactory = /** @class */ (function () {
    function PipeValueFactory(value) {
        // value source
        this.value = {};
        // custom functions
        this.execFunctions = [];
        // 保存方法返回值的Map
        this.returnValueMap = new Map();
        // extend functions
        this.extendFunctions = [];
        // just for temp once extend functions
        this.extendOnceFunctions = [];
        this.value = value;
    }
    PipeValueFactory.prototype.getValue = function () {
        return this.value;
    };
    PipeValueFactory.prototype.setValue = function (value) {
        this.value = __assign(__assign({}, this.value), value);
    };
    PipeValueFactory.prototype.clearExec = function () {
        this.execFunctions = [];
    };
    PipeValueFactory.prototype.appendExecFunction = function (func) {
        this.execFunctions.push(func);
    };
    PipeValueFactory.prototype.startRecordFunction = function () {
        this.clearExec();
    };
    PipeValueFactory.prototype.execFunction = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, func;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _i = 0, _a = this.execFunctions;
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        func = _a[_i];
                        return [4 /*yield*/, func()];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4:
                        this.clearExec();
                        return [2 /*return*/];
                }
            });
        });
    };
    PipeValueFactory.prototype.saveReturnValue = function (custom, returnValue) {
        this.returnValueMap.set(custom, returnValue);
    };
    PipeValueFactory.prototype.getReturnValue = function (custom) {
        return this.returnValueMap.get(custom);
    };
    PipeValueFactory.createPipeValue = function (value) {
        return new PipeValueFactory(value);
    };
    return PipeValueFactory;
}());

// 创建传入的start方法
function createCustomStartFunction(valueFactory, config) {
    var _this = this;
    // 对customStart方法的转换
    var formattedCustomStart = {};
    var _loop_1 = function (key, value) {
        formattedCustomStart[key] = function (custom) {
            // 把执行方法添加到execFunction中
            var customFunction = function () { return __awaiter(_this, void 0, void 0, function () {
                var returnValue, tempReturnValue;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, value(valueFactory.getValue())];
                        case 1:
                            returnValue = _a.sent();
                            return [4 /*yield*/, custom(returnValue)];
                        case 2:
                            tempReturnValue = _a.sent();
                            // 将{customFunction: customReturnValue}存到Map中，把customFunction传到下一级中用Map取值
                            valueFactory.saveReturnValue(customFunction, tempReturnValue);
                            return [2 /*return*/];
                    }
                });
            }); };
            valueFactory.appendExecFunction(customFunction);
            return __assign(__assign(__assign({}, createPipeEnd(valueFactory)), createCustomStartFunction(valueFactory, config)), createPipe(valueFactory, config, customFunction));
        };
    };
    // 遍历config对象，定义新的方法
    for (var _i = 0, _a = Object.entries(config); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], value = _b[1];
        _loop_1(key, value);
    }
    return formattedCustomStart;
}
// 创建pipe方法
function createPipe(valueFactory, config, customFunctionInMap) {
    return __assign(__assign({ pipe: function (custom) {
            var _this = this;
            var customFunction = function () { return __awaiter(_this, void 0, void 0, function () {
                var returnValue, tempReturnValue;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            returnValue = valueFactory.getReturnValue(customFunctionInMap);
                            return [4 /*yield*/, custom(returnValue, valueFactory.setValue.bind(valueFactory))];
                        case 1:
                            tempReturnValue = _a.sent();
                            // 将{customFunction: customReturnValue}存到Map中，把customFunction传到下一级中用Map取值
                            valueFactory.saveReturnValue(customFunction, tempReturnValue);
                            return [2 /*return*/];
                    }
                });
            }); };
            valueFactory.appendExecFunction(customFunction);
            return __assign(__assign(__assign({}, createPipe(valueFactory, config, customFunction)), createPipeEnd(valueFactory)), createCustomStartFunction(valueFactory, config));
        } }, createPipeEnd(valueFactory)), createCustomStartFunction(valueFactory, config));
}
// 创建pipeEnd方法
function createPipeEnd(valueFactory) {
    return {
        pipeEnd: function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: 
                        // 顺序执行方法
                        return [4 /*yield*/, valueFactory.execFunction()];
                        case 1:
                            // 顺序执行方法
                            _a.sent();
                            // 清空方法
                            valueFactory.clearExec();
                            // 返回最后的value值
                            return [2 /*return*/, Promise.resolve(valueFactory.getValue())];
                    }
                });
            });
        }
    };
}
function createPipeCore(value, config) {
    if (config === void 0) { config = {}; }
    var _value = PipeValueFactory.createPipeValue(value);
    return createCustomStartFunction(_value, config);
}

export { createPipeCore };
