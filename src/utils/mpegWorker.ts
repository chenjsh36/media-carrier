import { get } from 'lodash';

export interface IWorkerEvent {
  data: {
    type: string;
    data: {
      MEMFS: { data: ArrayBuffer }[];
    };
  };
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
  console.log('worker:', path);
  const worker = new Worker(path);
  return worker;
}

function __timeToMillisecond(time: string): number {
  const [hour, minute, second] = time.split(':').map(str => parseFloat(str));
  let millisecond = 0;
  millisecond += second * 1000;
  millisecond += minute * 60 * 1000;
  millisecond += hour * 60 * 60 * 1000;
  return millisecond;
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
            duration = __timeToMillisecond(
              msg.match(durationReg)[1] || '00:00:01',
            );
          } else if (currentTimeReg.test(msg)) {
            currentTime = __timeToMillisecond(
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
          console.log('worker stdout: ', event.data.data);
          break;

        case 'start':
          console.log('worker receive your command and start to work:)');
          break;

        case 'done':
          progressCallback &&
            progressCallback({ progress: 1, currentTime, duration });
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

    const failHandler = function(error: any) {
      worker.removeEventListener('error', failHandler);
      reject(error);
    };

    worker.addEventListener('message', successHandler);
    worker.addEventListener('error', failHandler);
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
  console.log('pmtopromise:', key);

  return new Promise((resolve, reject) => {
    const successHandler = function(event: IWorkerEvent) {
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

    const failHandler = function(error: any) {
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

export function waitForWorkerIsReady(
  worker: Worker,
  onSuccess?: Function,
  onFail?: Function,
): Promise<any> {
  return new Promise((resolve, reject) => {
    const handleReady = function(event: IWorkerEvent) {
      if (event.data.type === 'ready') {
        worker.removeEventListener('message', handleReady);
        onSuccess && onSuccess();
        resolve();
      }
    };
    const handleError = (err: any) => {
      worker.removeEventListener('error', handleError);
      onFail && onFail(err);
      reject(err);
    };
    worker.addEventListener('message', handleReady);
    worker.addEventListener('error', handleError);
  });
}
