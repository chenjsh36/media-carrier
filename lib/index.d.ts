import * as DataTransform from './utils/dataTransform';
export declare const Utils: typeof DataTransform;
interface IOutput {
    md5?: string;
    arrayBuffer?: ArrayBuffer;
    blob?: Blob;
    logs: string[][];
}
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
    clip: (originBlob: Blob, conf: {
        startTime: string;
        endTime: string;
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
    md5: (originBlog: Blob, conf: {
        formatType: string;
    }) => Promise<IOutput>;
}
export {};
