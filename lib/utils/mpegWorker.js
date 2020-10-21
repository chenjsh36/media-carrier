import { get } from 'lodash';
import { time2Millisecond } from './common';
export function createWorker(path) {
    var worker = new Worker(path);
    return worker;
}
function addWorkerEventListener(worker, eventName, fn) {
    if (worker.addEventListener) {
        worker.addEventListener(eventName, fn);
        return;
    }
    worker["on" + eventName] = fn;
}
function removeWorkerEventListener(worker, eventName, fn) {
    if (worker.removeEventListener) {
        worker.removeEventListener(eventName, fn);
        return;
    }
    worker["on" + eventName] = null;
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
                        duration = time2Millisecond(msg.match(durationReg)[1] || '00:00:01');
                    }
                    else if (currentTimeReg.test(msg)) {
                        currentTime = time2Millisecond(msg.match(currentTimeReg)[1] || '00:00:00');
                    }
                    var progress = currentTime / duration || 0;
                    progressCallback &&
                        progressCallback({
                            progress: progress >= 0.999 ? 0.999 : progress,
                            currentTime: currentTime,
                            duration: duration,
                        });
                    break;
                case 'start':
                    // console.log('worker receive your command and start to work:)');
                    break;
                case 'done':
                    progressCallback &&
                        progressCallback({ progress: 1, currentTime: currentTime, duration: duration });
                    removeWorkerEventListener(worker, 'message', successHandler);
                    result.buffer = get(event, 'data.data.MEMFS.0.data', null);
                    resolve(result);
                    break;
                case 'error':
                    removeWorkerEventListener(worker, 'message', successHandler);
                    reject(event.data.data);
                    break;
                default:
                    break;
            }
        };
        var failHandler = function (error) {
            removeWorkerEventListener(worker, 'error', failHandler);
            worker.removeEventListener('error', failHandler);
            reject(error);
        };
        addWorkerEventListener(worker, 'message', successHandler);
        addWorkerEventListener(worker, 'error', failHandler);
        postInfo && worker.postMessage(postInfo);
    });
}
export function pmToPromise(worker, postInfo, key) {
    var result = {
        buffer: null,
        logs: [],
    };
    return new Promise(function (resolve, reject) {
        var successHandler = function (event) {
            result.logs.push(get(event, 'data.data', '').toString());
            switch (event.data.type) {
                case 'stdout':
                    // case 'stderr':
                    break;
                case 'start':
                    // worker receive your command and start to work
                    break;
                case 'done':
                    removeWorkerEventListener(worker, 'message', successHandler);
                    result.buffer = get(event, 'data.data.MEMFS.0.data', null);
                    resolve(result);
                    break;
                case 'error':
                    removeWorkerEventListener(worker, 'message', successHandler);
                    reject(event.data.data);
                    break;
                default:
                    break;
            }
        };
        var failHandler = function (error) {
            removeWorkerEventListener(worker, 'error', failHandler);
            reject(error);
        };
        addWorkerEventListener(worker, 'message', successHandler);
        addWorkerEventListener(worker, 'error', failHandler);
        // postInfo && worker.postMessage(postInfo);
        postInfo && worker.postMessage(postInfo, [postInfo.MEMFS[0].data]);
    });
}
export function waitForWorkerIsReady(worker, onSuccess, onFail) {
    return new Promise(function (resolve, reject) {
        var handleReady = function (event) {
            if (event.data.type === 'ready') {
                removeWorkerEventListener(worker, 'message', handleReady);
                onSuccess && onSuccess();
                resolve();
            }
        };
        var handleError = function (err) {
            removeWorkerEventListener(worker, 'error', handleError);
            onFail && onFail(err);
            reject(err);
        };
        addWorkerEventListener(worker, 'message', handleReady);
        addWorkerEventListener(worker, 'error', handleError);
    });
}
//# sourceMappingURL=mpegWorker.js.map