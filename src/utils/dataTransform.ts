import { get } from 'lodash';
import Request from './request';


export function arrayBuffer2Blob(arrayBuffer: any, type: string ) {
  const blob = new Blob([arrayBuffer], { type });
  return blob;
}

export function arrayBuffer2File(arrayBuffer: any, name: string, options?: { type?: string; lastModified?: number } ) {
  const file = new File([arrayBuffer], name, options);
  return file;
}

export function blob2ArrayBuffer(blob: Blob): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();

    fileReader.onload = function() {
      resolve(fileReader.result as ArrayBuffer);
    };

    fileReader.onerror = function(evt) {
      const err1 = get(evt, 'target.error.code', 'NO CODE');
      const err2 = get(fileReader, 'error.code', 'NO CODE');

      reject(`fileReader read blob error: ${err1} or ${err2}`);
    };
    fileReader.readAsArrayBuffer(blob);
  });
}

export function blob2ObjectURL(blob: Blob): string {
  const url = URL.createObjectURL(blob);
  return url;
}

export function blob2AudioEelemnt(blob: Blob): HTMLAudioElement {
  const url = blob2ObjectURL(blob);
  return new Audio(url);
}

export function blob2VideoElement(blob: Blob): HTMLVideoElement {
  const url = blob2ObjectURL(blob);
  const video = document.createElement('video');
  video.src = url;
  return video;
}


type FileType = 'arrayBuffer' | 'file';
export async function reqMedia(url: string, fileType: FileType = 'arrayBuffer' ): Promise<ArrayBuffer | Blob> {
  if (!url) return Promise.resolve(null);
  return Request({
    url,
    method: 'get',
    responseType: 'arraybuffer',
  }).then((res: any) => {
    const arrayBuffer = res.data;
    const contentType = res.headers['content-type'] || '';
    
    let ret = arrayBuffer;

    if (fileType === 'file') {
      ret = arrayBuffer2File(ret, 'result', { type: contentType });
    }
    return ret;
  })
};

export default {
  arrayBuffer2Blob,
  arrayBuffer2File,
  blob2ArrayBuffer,
  blob2AudioEelemnt,
  blob2VideoElement,
  blob2ObjectURL,
  reqMedia,
}