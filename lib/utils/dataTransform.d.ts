export declare function arrayBuffer2Blob(arrayBuffer: any, type: string): Blob;
export declare function arrayBuffer2File(arrayBuffer: any, name: string, options?: {
    type?: string;
    lastModified?: number;
}): File;
export declare function blob2ArrayBuffer(blob: Blob): Promise<ArrayBuffer>;
export declare function blob2ObjectURL(blob: Blob): string;
export declare function blob2AudioEelemnt(blob: Blob): HTMLAudioElement;
export declare function blob2VideoElement(blob: Blob): HTMLVideoElement;
declare type FileType = 'arrayBuffer' | 'file';
export declare function reqMedia(url: string, fileType?: FileType): Promise<ArrayBuffer | Blob>;
declare const _default: {
    arrayBuffer2Blob: typeof arrayBuffer2Blob;
    arrayBuffer2File: typeof arrayBuffer2File;
    blob2ArrayBuffer: typeof blob2ArrayBuffer;
    blob2AudioEelemnt: typeof blob2AudioEelemnt;
    blob2VideoElement: typeof blob2VideoElement;
    blob2ObjectURL: typeof blob2ObjectURL;
    reqMedia: typeof reqMedia;
};
export default _default;
