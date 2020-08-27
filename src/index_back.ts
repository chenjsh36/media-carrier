import {
  createWorker,
  waitForWorkerIsReady,
  createTimeoutPromise,
  getClipCommand,
  blob2ArrayBuffer,
  pmToPromise,
  arrayBuffer2Blob,
} from './utils/index';


export function HelloWorld(): void {
  console.log('hello world !!!');
}


export interface IOutput {
  blob: Blob;
  logs: string[][];
}

const DEFAULT_TIMEOUT = 30 * 1000;

export default class MediaCarrier {
  private worker: Worker;
  private timeout: number;

  constructor(conf: { timeout: number } = { timeout: DEFAULT_TIMEOUT }) {
    console.log('new a media carrier')
    this.timeout = conf.timeout || DEFAULT_TIMEOUT;
  }

  public open = (conf: {
    workerPath: string;
    onSuccess?: Function;
    onFail?: Function;
  }): Promise<any> => {
    if (this.worker) {
      console.error('There already exist worker, you should use .close() to close before open');
      return;
    }
    const { workerPath, onSuccess, onFail } = conf;

    const worker = createWorker(workerPath);
    const p1 = waitForWorkerIsReady(worker, onSuccess, onFail);
    const p2 = createTimeoutPromise(DEFAULT_TIMEOUT);
    this.worker = worker;
    return Promise.race([p1, p2]);
  };

  public close = () => {
    this.worker.terminate();
    this.worker = null;
  }

  public clip = async( originBlob: Blob, conf: { startTime: string, endTime: string, mediaType: string, formatType: string}): Promise<IOutput> => {
    console.log('clip:', originBlob);    
    const arrayBuffer = await blob2ArrayBuffer(originBlob);
    console.log('clip:', originBlob, arrayBuffer);
    const { startTime, endTime, mediaType, formatType } = conf;
    const commond = getClipCommand({
      arrayBuffer,
      startTime,
      endTime,
      formatType ,
    })
    const result = await pmToPromise(this.worker, commond);

    return {
      blob: arrayBuffer2Blob(result.buffer, `${mediaType}/${formatType}`),
      logs: [result.logs],
    }
  }
}