var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
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
};
import { mpegWorker, mpegCommand, dataTransform, time, md5, } from './utils';
var createWorker = mpegWorker.createWorker, waitForWorkerIsReady = mpegWorker.waitForWorkerIsReady, pmToPromise = mpegWorker.pmToPromise;
var getClipCommand = mpegCommand.getClipCommand;
var blob2ArrayBuffer = dataTransform.blob2ArrayBuffer, arrayBuffer2Blob = dataTransform.arrayBuffer2Blob;
var createTimeoutPromise = time.createTimeoutPromise, sec2Time = time.sec2Time, time2Sec = time.time2Sec;
var calcMD5 = md5.calcMD5;
var DEFAULT_TIMEOUT = 30 * 1000;
var ID = 0;
export var Utils = __assign(__assign({}, dataTransform), { sec2Time: sec2Time,
    time2Sec: time2Sec,
    calcMD5: calcMD5 });
var MediaCarrier = /** @class */ (function () {
    function MediaCarrier(conf) {
        var _this = this;
        if (conf === void 0) { conf = { timeout: DEFAULT_TIMEOUT }; }
        this.open = function (conf) {
            if (_this.worker) {
                console.error('There already exist worker, you should use .close() to close before open');
                return;
            }
            var workerPath = conf.workerPath, onSuccess = conf.onSuccess, onFail = conf.onFail;
            var worker = createWorker(workerPath);
            var p1 = waitForWorkerIsReady(worker, onSuccess, onFail);
            var p2 = createTimeoutPromise(_this.timeout);
            _this.worker = worker;
            return Promise.race([p1, p2]);
        };
        this.close = function () {
            _this.worker.terminate();
            _this.worker = null;
        };
        /**
         * 对媒体文件进行剪辑
         * @param originBlob 原始 Blob 文件
         * @param conf 剪辑参数
         */
        this.clip = function (originBlob, conf) { return __awaiter(_this, void 0, void 0, function () {
            var arrayBuffer, startTime, endTime, duration, _a, mediaType, _b, formatType, command, result;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, blob2ArrayBuffer(originBlob)];
                    case 1:
                        arrayBuffer = _c.sent();
                        startTime = conf.startTime, endTime = conf.endTime, duration = conf.duration, _a = conf.mediaType, mediaType = _a === void 0 ? 'video' : _a, _b = conf.formatType, formatType = _b === void 0 ? 'mp4' : _b;
                        command = getClipCommand({
                            arrayBuffer: arrayBuffer,
                            startTime: startTime,
                            endTime: endTime,
                            duration: duration,
                            formatType: formatType,
                        });
                        return [4 /*yield*/, pmToPromise(this.worker, command, "" + this.id)];
                    case 2:
                        result = _c.sent();
                        return [2 /*return*/, {
                                arrayBuffer: result.buffer,
                                blob: arrayBuffer2Blob(result.buffer, mediaType + "/" + formatType),
                                logs: [result.logs],
                            }];
                }
            });
        }); };
        /**
         * 计算文件的 MD5 值
         * @param originBlob
         * @param conf
         */
        this.md5 = function (originBlob) { return __awaiter(_this, void 0, void 0, function () {
            var arrayBuffer, md5Val;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, blob2ArrayBuffer(originBlob)];
                    case 1:
                        arrayBuffer = _a.sent();
                        return [4 /*yield*/, calcMD5(arrayBuffer)];
                    case 2:
                        md5Val = _a.sent();
                        return [2 /*return*/, {
                                md5: md5Val,
                                logs: [],
                            }];
                }
            });
        }); };
        /**
         * 自定义 FFmpeg 命令执行
         * @param originBlob
         * @param conf
         */
        this.runCommands = function (originBlob, conf) { return __awaiter(_this, void 0, void 0, function () {
            var arrayBuffer, _a, formatType, _b, args, command, result;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, blob2ArrayBuffer(originBlob)];
                    case 1:
                        arrayBuffer = _c.sent();
                        _a = conf.formatType, formatType = _a === void 0 ? 'mp4' : _a, _b = conf.args, args = _b === void 0 ? [] : _b;
                        command = {
                            type: 'run',
                            arguments: args,
                            MEMFS: [
                                {
                                    // data: new Uint8Array(arrayBuffer as any),
                                    data: arrayBuffer,
                                    name: "input." + formatType,
                                },
                            ]
                        };
                        return [4 /*yield*/, pmToPromise(this.worker, command)];
                    case 2:
                        result = _c.sent();
                        return [2 /*return*/, {
                                md5: result.buffer,
                                logs: [result.logs],
                            }];
                }
            });
        }); };
        /**
         * 剪辑 + 调整视频大小, 内部测试使用
         * @param originBlob 原视视频
         * @param conf
         */
        this.clipAndResize = function (originBlob, conf) { return __awaiter(_this, void 0, void 0, function () {
            var arrayBuffer, startTime, endTime, mediaType, formatType, _a, width, command, result;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, blob2ArrayBuffer(originBlob)];
                    case 1:
                        arrayBuffer = _b.sent();
                        startTime = conf.startTime, endTime = conf.endTime, mediaType = conf.mediaType, formatType = conf.formatType, _a = conf.width, width = _a === void 0 ? 640 : _a;
                        command = {
                            type: 'run',
                            arguments: ("-ss " + startTime + " -t " + endTime + " -accurate_seek -i ./input." + formatType + " -c:v libx264 -filter:v scale=" + width + ":-1 -f mp4 ./output").split(' '),
                            MEMFS: [
                                {
                                    data: new Uint8Array(arrayBuffer),
                                    name: "input." + formatType,
                                },
                            ],
                            TOTAL_MEMORY: 1073741824,
                        };
                        return [4 /*yield*/, pmToPromise(this.worker, command, "" + this.id)];
                    case 2:
                        result = _b.sent();
                        return [2 /*return*/, {
                                arrayBuffer: result.buffer,
                                blob: arrayBuffer2Blob(result.buffer, mediaType + "/" + formatType),
                                logs: [result.logs]
                            }];
                }
            });
        }); };
        /**
         * 剪辑 + 改变大小 + 压缩，内部测试使用
         * @param originBlob
         * @param conf
         */
        this.mediaSpaceClip = function (originBlob, conf) { return __awaiter(_this, void 0, void 0, function () {
            var arrayBuffer, startTime, endTime, mediaType, formatType, _a, width, command, result;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, blob2ArrayBuffer(originBlob)];
                    case 1:
                        arrayBuffer = _b.sent();
                        startTime = conf.startTime, endTime = conf.endTime, mediaType = conf.mediaType, formatType = conf.formatType, _a = conf.width, width = _a === void 0 ? 640 : _a;
                        command = {
                            type: 'run',
                            arguments: ("-ss " + startTime + " -t " + endTime + " -y -hide_banner -loglevel debug -accurate_seek -i ./input." + formatType + " -c:v libx264 -preset ultrafast -filter:v scale=" + width + ":-1 -crf 23 -maxrate 1024K -bufsize 1536K -movflags +faststart -tune zerolatency -f mp4 ./output").split(' '),
                            MEMFS: [
                                {
                                    // data: new Uint8Array(arrayBuffer as any),
                                    data: arrayBuffer,
                                    name: "input." + formatType,
                                },
                            ],
                        };
                        return [4 /*yield*/, pmToPromise(this.worker, command, "" + this.id)];
                    case 2:
                        result = _b.sent();
                        return [2 /*return*/, {
                                arrayBuffer: result.buffer,
                                blob: arrayBuffer2Blob(result.buffer, mediaType + "/" + formatType),
                                logs: [result.logs]
                            }];
                }
            });
        }); };
        this.timeout = conf.timeout || DEFAULT_TIMEOUT;
        this.id = ID++;
    }
    return MediaCarrier;
}());
export default MediaCarrier;
//# sourceMappingURL=index.js.map