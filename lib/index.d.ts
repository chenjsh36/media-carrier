import { dataTransform, common } from './utils';
interface IOutput {
    md5?: string;
    arrayBuffer?: ArrayBuffer;
    blob?: Blob;
    logs: string[][];
}
export declare const Utils: {
    sec2Time: typeof common.sec2Time;
    time2Sec: typeof common.time2Sec;
    arrayBuffer2Blob(arrayBuffer: any, type: string): Blob;
    arrayBuffer2File(arrayBuffer: any, name: string, options?: {
        type?: string;
        lastModified?: number;
    }): File;
    blob2ArrayBuffer(blob: Blob): Promise<ArrayBuffer>;
    blob2ObjectURL(blob: Blob): string;
    blob2AudioEelemnt(blob: Blob): HTMLAudioElement;
    blob2VideoElement(blob: Blob): HTMLVideoElement;
    reqMedia(url: string, fileType?: "arrayBuffer" | "file"): Promise<ArrayBuffer | Blob>;
    default: {
        arrayBuffer2Blob: typeof dataTransform.arrayBuffer2Blob;
        arrayBuffer2File: typeof dataTransform.arrayBuffer2File;
        blob2ArrayBuffer: typeof dataTransform.blob2ArrayBuffer;
        blob2AudioEelemnt: typeof dataTransform.blob2AudioEelemnt;
        blob2VideoElement: typeof dataTransform.blob2VideoElement;
        blob2ObjectURL: typeof dataTransform.blob2ObjectURL;
        reqMedia: typeof dataTransform.reqMedia;
    };
};
export default class MediaCarrier {
    private worker;
    private timeout;
    private id;
    constructor(conf?: {
        timeout: number;
    });
    open: (conf: {
        workerPath: string;
        onSuccess?: Function;
        onFail?: Function;
    }) => Promise<any>;
    close: () => void;
    /**
     * 对媒体文件进行剪辑
     * @param originBlob 原始 Blob 文件
     * @param conf 剪辑参数
     */
    clip: (originBlob: Blob, conf: {
        startTime: string;
        endTime?: string;
        duration?: string;
        mediaType: string;
        formatType: string;
    }) => Promise<IOutput>;
    withoutPresetClip: (originBlob: Blob, conf: {
        startTime: string;
        endTime: string;
        mediaType: string;
        formatType: string;
        width: number;
    }) => Promise<IOutput>;
    mediaSpaceClip: (originBlob: Blob, conf: {
        startTime: string;
        endTime: string;
        mediaType: string;
        formatType: string;
        width: number;
    }) => Promise<IOutput>;
    md5: (originBlob: Blob, conf: {
        formatType: string;
    }) => Promise<IOutput>;
}
export {};
