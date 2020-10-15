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
import { get } from 'lodash';
import Request from './request';
export function arrayBuffer2Blob(arrayBuffer, type) {
    var blob = new Blob([arrayBuffer], { type: type });
    return blob;
}
export function arrayBuffer2File(arrayBuffer, name, options) {
    var file = new File([arrayBuffer], name, options);
    return file;
}
export function blob2ArrayBuffer(blob) {
    return new Promise(function (resolve, reject) {
        var fileReader = new FileReader();
        fileReader.onload = function () {
            resolve(fileReader.result);
        };
        fileReader.onerror = function (evt) {
            var err1 = get(evt, 'target.error.code', 'NO CODE');
            var err2 = get(fileReader, 'error.code', 'NO CODE');
            reject("fileReader read blob error: " + err1 + " or " + err2);
        };
        fileReader.readAsArrayBuffer(blob);
    });
}
export function blob2ObjectURL(blob) {
    var url = URL.createObjectURL(blob);
    return url;
}
export function blob2AudioEelemnt(blob) {
    var url = blob2ObjectURL(blob);
    return new Audio(url);
}
export function blob2VideoElement(blob) {
    var url = blob2ObjectURL(blob);
    var video = document.createElement('video');
    video.src = url;
    return video;
}
export function reqMedia(url, fileType) {
    if (fileType === void 0) { fileType = 'arrayBuffer'; }
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (!url)
                return [2 /*return*/, Promise.resolve(null)];
            return [2 /*return*/, Request({
                    url: url,
                    method: 'get',
                    responseType: 'arraybuffer',
                }).then(function (res) {
                    var arrayBuffer = res.data;
                    var contentType = res.headers['content-type'] || '';
                    var ret = arrayBuffer;
                    if (fileType === 'file') {
                        ret = arrayBuffer2File(ret, 'result', { type: contentType });
                    }
                    return ret;
                })];
        });
    });
}
;
export default {
    arrayBuffer2Blob: arrayBuffer2Blob,
    arrayBuffer2File: arrayBuffer2File,
    blob2ArrayBuffer: blob2ArrayBuffer,
    blob2AudioEelemnt: blob2AudioEelemnt,
    blob2VideoElement: blob2VideoElement,
    blob2ObjectURL: blob2ObjectURL,
    reqMedia: reqMedia,
};
//# sourceMappingURL=dataTransform.js.map