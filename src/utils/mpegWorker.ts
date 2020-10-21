import { get } from 'lodash';
import { time2Millisecond } from './common';

export type IWorkerEventName = 'message' | 'error';
export interface IWorkerEvent {
  data: {
    type: string;
    data: {
      MEMFS: { data: ArrayBuffer }[];
    };
  };
}
export interface IWorkerEventCallback {
  (e: MessageEvent | ErrorEvent): any;
}
export interface IPostInfo {
  type: string;
  arguments: string[];
  MEMFS: any[];
}

export interface IProgressCallback {
  (params: { progress: number; duration: number; currentTime: number }): void;
}

export function createWorker(path: string) {
  const worker = new Worker(path);
  return worker;
}

function addWorkerEventListener(worker: Worker, eventName: IWorkerEventName, fn: IWorkerEventCallback) {
  if (worker.addEventListener) {
    worker.addEventListener(eventName, fn);
    return;
  }
  worker[`on${eventName}` as 'onmessage'] = fn;
}
function removeWorkerEventListener(worker: Worker, eventName: IWorkerEventName, fn: IWorkerEventCallback) {
  if (worker.removeEventListener) {
    worker.removeEventListener(eventName, fn );
    return;
  }
  worker[`on${eventName}` as 'onmessage'] = null;
}

export function pmToPromiseWithProgress(
  worker: Worker,
  postInfo?: IPostInfo,
  progressCallback?: IProgressCallback,
): Promise<{ buffer: ArrayBuffer; logs: string[] }> {
  let duration: number;
  let currentTime: number = 0;
  const durationReg = /Duration: (.+), start/;
  const currentTimeReg = /time=(.+) bitrate/;
  const result: { buffer: ArrayBuffer; logs: string[] } = {
    buffer: null,
    logs: [],
  };

  return new Promise((resolve, reject) => {
    const successHandler = function(event: IWorkerEvent) {
      result.logs.push(get(event, 'data.data', '').toString());

      switch (event.data.type) {
        case 'stdout':
        case 'stderr':
          const msg = get(event, 'data.data', '') as string;
          if (durationReg.test(msg)) {
            duration = time2Millisecond(
              msg.match(durationReg)[1] || '00:00:01',
            );
          } else if (currentTimeReg.test(msg)) {
            currentTime = time2Millisecond(
              msg.match(currentTimeReg)[1] || '00:00:00',
            );
          }

          const progress = currentTime / duration || 0;

          progressCallback &&
            progressCallback({
              progress: progress >= 0.999 ? 0.999 : progress,
              currentTime,
              duration,
            });
          break;

        case 'start':
          // console.log('worker receive your command and start to work:)');
          break;

        case 'done':
          progressCallback &&
            progressCallback({ progress: 1, currentTime, duration });
          removeWorkerEventListener(worker, 'message', successHandler as IWorkerEventCallback);
          result.buffer = get(event, 'data.data.MEMFS.0.data', null);
          resolve(result);
          break;

        case 'error':
          removeWorkerEventListener(worker, 'message', successHandler as IWorkerEventCallback)
          reject(event.data.data);
          break;

        default:
          break;
      }
    };

    const failHandler = function(error: any) {
      removeWorkerEventListener(worker, 'error', failHandler as IWorkerEventCallback);
      worker.removeEventListener('error', failHandler);
      reject(error);
    };
    addWorkerEventListener(worker, 'message', successHandler as IWorkerEventCallback);
    addWorkerEventListener(worker, 'error', failHandler as IWorkerEventCallback);
    postInfo && worker.postMessage(postInfo);
  });
}

export function pmToPromise(
  worker: Worker,
  postInfo?: IPostInfo,
  key?: string,
): Promise<{ buffer: ArrayBuffer | string; logs: string[] }> {
  const result: any = {
    buffer: null,
    logs: [],
  };


  return new Promise((resolve, reject) => {
    const successHandler = function(event: IWorkerEvent) {
      result.logs.push(get(event, 'data.data', '').toString());

      switch (event.data.type) {
        case 'stdout':
          // case 'stderr':
          break;

        case 'start':
          // worker receive your command and start to work
          break;

        case 'done':
          removeWorkerEventListener(worker, 'message', successHandler as IWorkerEventCallback);
          result.buffer = get(event, 'data.data.MEMFS.0.data', null);
          resolve(result);
          break;

        case 'error':
          removeWorkerEventListener(worker, 'message', successHandler as IWorkerEventCallback);
          reject(event.data.data);
          break;

        default:
          break;
      }
    };

    const failHandler = function(error: any) {
      removeWorkerEventListener(worker, 'error', failHandler as IWorkerEventCallback);
      reject(error);
    };
    addWorkerEventListener(worker, 'message', successHandler as IWorkerEventCallback);
    addWorkerEventListener(worker, 'error', failHandler);
    // postInfo && worker.postMessage(postInfo);
    postInfo && worker.postMessage(postInfo, [postInfo.MEMFS[0].data]);
  });
}

export function waitForWorkerIsReady(
  worker: Worker,
  onSuccess?: Function,
  onFail?: Function,
): Promise<any> {
  return new Promise((resolve, reject) => {
    const handleReady = function(event: IWorkerEvent) {
      if (event.data.type === 'ready') {
        removeWorkerEventListener(worker, 'message', handleReady as IWorkerEventCallback);
        onSuccess && onSuccess();
        resolve();
      }
    };
    const handleError = (err: any) => {
      removeWorkerEventListener(worker, 'error', handleError as IWorkerEventCallback);
      onFail && onFail(err);
      reject(err);
    };
    addWorkerEventListener(worker, 'message', handleReady as IWorkerEventCallback);
    addWorkerEventListener(worker, 'error', handleError as IWorkerEventCallback);
  });
}
