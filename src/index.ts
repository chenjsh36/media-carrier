import {
  createWorker,
  waitForWorkerIsReady,
  pmToPromise,
} from './utils/mpegWorker';
import {
  createTimeoutPromise,
} from './utils/common';
import {
  getClipCommand,
} from './utils/mpegCommand';
import * as DataTransform from './utils/dataTransform';

export const Utils = DataTransform;

interface IOutput {
  md5?: string;
  arrayBuffer?: ArrayBuffer;
  blob?: Blob;
  logs: string[][];
}

const DEFAULT_TIMEOUT = 30 * 1000;

let ID = 0;

export default class MediaCarrier {
  private worker: Worker;
  private timeout: number;
  private id: number;

  constructor(conf: { timeout: number } = { timeout: DEFAULT_TIMEOUT }) {
    console.log('new a media carrier')
    this.timeout = conf.timeout || DEFAULT_TIMEOUT;
    this.id = ID++;
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
    console.log('to create worker:', workerPath);
    const worker = createWorker(workerPath);
    console.log('worker:', worker);
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
    const arrayBuffer = await DataTransform.blob2ArrayBuffer(originBlob);
    const { startTime, endTime, mediaType, formatType } = conf;
    const command = getClipCommand({
      arrayBuffer,
      startTime,
      endTime,
      formatType ,
    })

    console.log('clip Common:', command);
    const result = await pmToPromise(this.worker, command, `${this.id}`);

    return {
      arrayBuffer: result.buffer as ArrayBuffer,
      blob: DataTransform.arrayBuffer2Blob(result.buffer, `${mediaType}/${formatType}`),
      logs: [result.logs],
    }
  }

  public withoutPresetClip = async ( originBlob: Blob, conf: { startTime: string, endTime: string, mediaType: string, formatType: string, width: number }): Promise<IOutput> => {
    let arrayBuffer = await DataTransform.blob2ArrayBuffer(originBlob);
    const { startTime, endTime, mediaType, formatType, width = 640 } = conf;
    const command = {
      type: 'run',
      arguments: `-ss ${startTime} -t ${endTime} -accurate_seek -i ./input.${formatType} -c:v libx264 -filter:v scale=${width}:-1 -f mp4 ./output`.split(' '),
      MEMFS: [
        {
          data: new Uint8Array(arrayBuffer as any),
          name: `input.${formatType}`,
        },
      ],
      TOTAL_MEMORY: 1073741824,
    };
    console.log('command:', command);
    console.log('this.ID is :', this.id);
    const result = await pmToPromise(this.worker, command, `${this.id}`);
    return {
      arrayBuffer: result.buffer as ArrayBuffer,
      blob: DataTransform.arrayBuffer2Blob(result.buffer, `${mediaType}/${formatType}`),
      logs: [result.logs]
    }
  }

  public mediaSpaceClip = async ( originBlob: Blob, conf: { startTime: string, endTime: string, mediaType: string, formatType: string, width: number }): Promise<IOutput> => {
    const arrayBuffer = await DataTransform.blob2ArrayBuffer(originBlob);
    const { startTime, endTime, mediaType, formatType, width = 640 } = conf;
    const command = {
      type: 'run',
      arguments: `-ss ${startTime} -t ${endTime} -y -hide_banner -loglevel debug -accurate_seek -i ./input.${formatType} -c:v libx264 -preset ultrafast -filter:v scale=${width}:-1 -crf 23 -maxrate 1024K -bufsize 1536K -movflags +faststart -tune zerolatency -f mp4 ./output`.split(' '),
      MEMFS: [
        {
          // data: new Uint8Array(arrayBuffer as any),
          data: arrayBuffer as any,
          name: `input.${formatType}`,
        },
      ],
    };
    console.log('command:', command);
    console.log('this.ID is :', this.id);
    const result = await pmToPromise(this.worker, command, `${this.id}`);
    return {
      arrayBuffer: result.buffer as ArrayBuffer,
      blob: DataTransform.arrayBuffer2Blob(result.buffer, `${mediaType}/${formatType}`),
      logs: [result.logs]
    }
  }

  public md5 = async ( originBlog: Blob, conf: { formatType: string } ): Promise<IOutput> => {
    const arrayBuffer = await DataTransform.blob2ArrayBuffer(originBlog);
    const { formatType = 'mp4' } = conf;
    const command = {
      type: 'run',
      arguments: `-i input.${formatType} -f hash -hash md5 output.md5`.split(' '),
      MEMFS: [
        {
          data: new Uint8Array(arrayBuffer as any),
          name: `input.${formatType}`,
        },
      ]
    };
    console.log('command', command);
    const result = await pmToPromise(this.worker, command);
    return {
      md5: result.buffer as string,
      logs: [result.logs],
    }
  }
}