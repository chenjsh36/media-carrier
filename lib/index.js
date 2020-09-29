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
import { createWorker, waitForWorkerIsReady, pmToPromise, } from './utils/mpegWorker';
import { createTimeoutPromise, } from './utils/common';
import { getClipCommand, } from './utils/mpegCommand';
import * as DataTransform from './utils/dataTransform';
export var Utils = DataTransform;
var DEFAULT_TIMEOUT = 30 * 1000;
var ID = 0;
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
            console.log('to create worker:', workerPath);
            var worker = createWorker(workerPath);
            console.log('worker:', worker);
            var p1 = waitForWorkerIsReady(worker, onSuccess, onFail);
            var p2 = createTimeoutPromise(DEFAULT_TIMEOUT);
            _this.worker = worker;
            return Promise.race([p1, p2]);
        };
        this.close = function () {
            _this.worker.terminate();
            _this.worker = null;
        };
        this.clip = function (originBlob, conf) { return __awaiter(_this, void 0, void 0, function () {
            var arrayBuffer, startTime, endTime, mediaType, formatType, command, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, DataTransform.blob2ArrayBuffer(originBlob)];
                    case 1:
                        arrayBuffer = _a.sent();
                        startTime = conf.startTime, endTime = conf.endTime, mediaType = conf.mediaType, formatType = conf.formatType;
                        command = getClipCommand({
                            arrayBuffer: arrayBuffer,
                            startTime: startTime,
                            endTime: endTime,
                            formatType: formatType,
                        });
                        console.log('clip Common:', command);
                        return [4 /*yield*/, pmToPromise(this.worker, command, "" + this.id)];
                    case 2:
                        result = _a.sent();
                        return [2 /*return*/, {
                                arrayBuffer: result.buffer,
                                blob: DataTransform.arrayBuffer2Blob(result.buffer, mediaType + "/" + formatType),
                                logs: [result.logs],
                            }];
                }
            });
        }); };
        this.withoutPresetClip = function (originBlob, conf) { return __awaiter(_this, void 0, void 0, function () {
            var arrayBuffer, startTime, endTime, mediaType, formatType, _a, width, command, result;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, DataTransform.blob2ArrayBuffer(originBlob)];
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
                        console.log('command:', command);
                        console.log('this.ID is :', this.id);
                        return [4 /*yield*/, pmToPromise(this.worker, command, "" + this.id)];
                    case 2:
                        result = _b.sent();
                        return [2 /*return*/, {
                                arrayBuffer: result.buffer,
                                blob: DataTransform.arrayBuffer2Blob(result.buffer, mediaType + "/" + formatType),
                                logs: [result.logs]
                            }];
                }
            });
        }); };
        this.mediaSpaceClip = function (originBlob, conf) { return __awaiter(_this, void 0, void 0, function () {
            var arrayBuffer, startTime, endTime, mediaType, formatType, _a, width, command, result;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, DataTransform.blob2ArrayBuffer(originBlob)];
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
                        console.log('command:', command);
                        console.log('this.ID is :', this.id);
                        return [4 /*yield*/, pmToPromise(this.worker, command, "" + this.id)];
                    case 2:
                        result = _b.sent();
                        return [2 /*return*/, {
                                arrayBuffer: result.buffer,
                                blob: DataTransform.arrayBuffer2Blob(result.buffer, mediaType + "/" + formatType),
                                logs: [result.logs]
                            }];
                }
            });
        }); };
        this.md5 = function (originBlog, conf) { return __awaiter(_this, void 0, void 0, function () {
            var arrayBuffer, _a, formatType, command, result;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, DataTransform.blob2ArrayBuffer(originBlog)];
                    case 1:
                        arrayBuffer = _b.sent();
                        _a = conf.formatType, formatType = _a === void 0 ? 'mp4' : _a;
                        command = {
                            type: 'run',
                            arguments: ("-i input." + formatType + " -f hash -hash md5 output.md5").split(' '),
                            MEMFS: [
                                {
                                    data: new Uint8Array(arrayBuffer),
                                    name: "input." + formatType,
                                },
                            ]
                        };
                        console.log('command', command);
                        return [4 /*yield*/, pmToPromise(this.worker, command)];
                    case 2:
                        result = _b.sent();
                        return [2 /*return*/, {
                                md5: result.buffer,
                                logs: [result.logs],
                            }];
                }
            });
        }); };
        console.log('new a media carrier');
        this.timeout = conf.timeout || DEFAULT_TIMEOUT;
        this.id = ID++;
    }
    return MediaCarrier;
}());
export default MediaCarrier;
//# sourceMappingURL=index.js.map