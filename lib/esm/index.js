/*! *****************************************************************************
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

var CoreValueFactory = /** @class */ (function () {
    function CoreValueFactory(value) {
        this.coreValue = value;
        this.funcArray = [];
    }
    CoreValueFactory.prototype.getValue = function () {
        return this.coreValue;
    };
    CoreValueFactory.prototype.setValue = function (value) {
        this.coreValue = __assign(__assign({}, this.coreValue), value);
    };
    // push一个function
    CoreValueFactory.prototype.appendFunc = function (func) {
        this.funcArray.push(func);
    };
    CoreValueFactory.prototype.initFuncArray = function () {
        this.funcArray = [];
    };
    // 消费整个functions列表
    CoreValueFactory.prototype.execFuncArray = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, func;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _i = 0, _a = this.funcArray;
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        func = _a[_i];
                        return [4 /*yield*/, func.call(null)];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4:
                        this.initFuncArray();
                        return [2 /*return*/];
                }
            });
        });
    };
    // 返回一个value的实例
    CoreValueFactory.createCoreValue = function (value) {
        return new CoreValueFactory(value);
    };
    return CoreValueFactory;
}());
function createCoreValue(value) {
    return CoreValueFactory.createCoreValue(value);
}
function createPipeValue(valueFactory, config) {
    var _this = this;
    // 添加默认的pipeStart和pipeEnd
    var pipeValue = {
        pipeStart: function () {
            valueFactory.initFuncArray();
            return pipeValue;
        },
        pipeEnd: function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, valueFactory.execFuncArray()];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        },
    };
    // 空的时候返回空
    if (!config) {
        return pipeValue;
    }
    var _loop_1 = function (name_1) {
        var func = config[name_1];
        pipeValue[name_1] = (function (customFunc) {
            valueFactory.appendFunc(function () { return __awaiter(_this, void 0, void 0, function () {
                var tempValue;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, func.call(null, valueFactory.getValue())];
                        case 1:
                            tempValue = _a.sent();
                            if (!customFunc) return [3 /*break*/, 3];
                            return [4 /*yield*/, customFunc(tempValue, valueFactory.setValue.bind(valueFactory))];
                        case 2:
                            _a.sent();
                            _a.label = 3;
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            return pipeValue;
        });
    };
    for (var name_1 in config) {
        _loop_1(name_1);
    }
    return pipeValue;
}
function createPipe(value, pipeFuncConfig) {
    var coreValue = createCoreValue(value);
    // 把开始的value的pipeEnd剔除掉
    return createPipeValue(coreValue, pipeFuncConfig);
}
function test() {
    return __awaiter(this, void 0, void 0, function () {
        var value;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    value = createPipe({ name: '123' }, {
                        getName: function (val) { return "".concat(val.name, " getName"); },
                        getNumberName: function (val) { return Number(val.name); },
                    });
                    return [4 /*yield*/, value
                            .pipeStart()
                            .getName(function (val) { return console.log(val); })
                            .getNumberName(function (val, update) {
                            console.log(val);
                            update({ name: '697' });
                        })
                            .getName(function (vak) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, console.log(vak)];
                        }); }); })
                            .pipeEnd()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
test();

export { createPipe as default };