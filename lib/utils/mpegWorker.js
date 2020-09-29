import { get } from 'lodash';
export function createWorker(path) {
    console.log('worker:', path);
    var worker = new Worker(path);
    return worker;
}
function __timeToMillisecond(time) {
    var _a = time.split(':').map(function (str) { return parseFloat(str); }), hour = _a[0], minute = _a[1], second = _a[2];
    var millisecond = 0;
    millisecond += second * 1000;
    millisecond += minute * 60 * 1000;
    millisecond += hour * 60 * 60 * 1000;
    return millisecond;
}
export function pmToPromiseWithProgress(worker, postInfo, progressCallback) {
    var duration;
    var currentTime = 0;
    var durationReg = /Duration: (.+), start/;
    var currentTimeReg = /time=(.+) bitrate/;
    var result = {
        buffer: null,
        logs: [],
    };
    return new Promise(function (resolve, reject) {
        var successHandler = function (event) {
            result.logs.push(get(event, 'data.data', '').toString());
            switch (event.data.type) {
                case 'stdout':
                case 'stderr':
                    var msg = get(event, 'data.data', '');
                    if (durationReg.test(msg)) {
                        duration = __timeToMillisecond(msg.match(durationReg)[1] || '00:00:01');
                    }
                    else if (currentTimeReg.test(msg)) {
                        currentTime = __timeToMillisecond(msg.match(currentTimeReg)[1] || '00:00:00');
                    }
                    var progress = currentTime / duration || 0;
                    progressCallback &&
                        progressCallback({
                            progress: progress >= 0.999 ? 0.999 : progress,
                            currentTime: currentTime,
                            duration: duration,
                        });
                    console.log('worker stdout: ', event.data.data);
                    break;
                case 'start':
                    console.log('worker receive your command and start to work:)');
                    break;
                case 'done':
                    progressCallback &&
                        progressCallback({ progress: 1, currentTime: currentTime, duration: duration });
                    worker.removeEventListener('message', successHandler);
                    result.buffer = get(event, 'data.data.MEMFS.0.data', null);
                    resolve(result);
                    break;
                case 'error':
                    worker.removeEventListener('message', successHandler);
                    reject(event.data.data);
                    break;
                default:
                    break;
            }
        };
        var failHandler = function (error) {
            worker.removeEventListener('error', failHandler);
            reject(error);
        };
        worker.addEventListener('message', successHandler);
        worker.addEventListener('error', failHandler);
        postInfo && worker.postMessage(postInfo);
    });
}
export function pmToPromise(worker, postInfo, key) {
    var result = {
        buffer: null,
        logs: [],
    };
    console.log('pmtopromise:', key);
    return new Promise(function (resolve, reject) {
        var successHandler = function (event) {
            console.log(key, get(event, 'data.data', ''));
            result.logs.push(get(event, 'data.data', '').toString());
            switch (event.data.type) {
                case 'stdout':
                    // case 'stderr':
                    console.log('worker stdout: ', event.data.data);
                    break;
                case 'start':
                    console.log('worker receive your command and start to work:)');
                    break;
                case 'done':
                    worker.removeEventListener('message', successHandler);
                    result.buffer = get(event, 'data.data.MEMFS.0.data', null);
                    resolve(result);
                    break;
                case 'error':
                    worker.removeEventListener('message', successHandler);
                    reject(event.data.data);
                    break;
                default:
                    break;
            }
        };
        var failHandler = function (error) {
            worker.removeEventListener('error', failHandler);
            reject(error);
        };
        worker.addEventListener('message', successHandler);
        worker.addEventListener('error', failHandler);
        // console.log('post message:', postInfo);
        postInfo && worker.postMessage(postInfo, [postInfo.MEMFS[0].data]);
        // postInfo && worker.postMessage(postInfo);
    });
}
export function waitForWorkerIsReady(worker, onSuccess, onFail) {
    return new Promise(function (resolve, reject) {
        var handleReady = function (event) {
            if (event.data.type === 'ready') {
                worker.removeEventListener('message', handleReady);
                onSuccess && onSuccess();
                resolve();
            }
        };
        var handleError = function (err) {
            worker.removeEventListener('error', handleError);
            onFail && onFail(err);
            reject(err);
        };
        worker.addEventListener('message', handleReady);
        worker.addEventListener('error', handleError);
    });
}
//# sourceMappingURL=mpegWorker.js.map