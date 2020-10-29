import { dataTransform, time, md5 } from './utils';
interface IOutput {
    md5?: string;
    arrayBuffer?: ArrayBuffer;
    blob?: Blob;
    logs: string[][];
}
export declare const Utils: {
    sec2Time: typeof time.sec2Time;
    time2Sec: typeof time.time2Sec;
    calcMD5: typeof md5.calcMD5;
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
    /**
     * 计算文件的 MD5 值
     * @param originBlob
     * @param conf
     */
    md5: (originBlob: Blob) => Promise<IOutput>;
    /**
     * 自定义 FFmpeg 命令执行
     * @param originBlob
     * @param conf
     */
    runCommands: (originBlob: Blob, conf: {
        formatType: string;
        args: string[];
    }) => Promise<IOutput>;
    /**
     * 剪辑 + 调整视频大小, 内部测试使用
     * @param originBlob 原视视频
     * @param conf
     */
    clipAndResize: (originBlob: Blob, conf: {
        startTime: string;
        endTime: string;
        mediaType: string;
        formatType: string;
        width: number;
    }) => Promise<IOutput>;
    /**
     * 剪辑 + 改变大小 + 压缩，内部测试使用
     * @param originBlob
     * @param conf
     */
    mediaSpaceClip: (originBlob: Blob, conf: {
        startTime: string;
        endTime: string;
        mediaType: string;
        formatType: string;
        width: number;
    }) => Promise<IOutput>;
}
export {};
