export declare function arrayBuffer2Blob(arrayBuffer: any, type: string): Blob;
export declare function arrayBuffer2File(arrayBuffer: any, name: string, options?: {
    type?: string;
    lastModified?: number;
}): void;
export declare function blob2ArrayBuffer(blob: Blob): Promise<ArrayBuffer>;
export declare function blob2ObjectURL(blob: Blob): Promise<string>;
export declare function blob2AudioEelemnt(blob: Blob): Promise<HTMLAudioElement>;
export declare function blob2VideoElement(blob: Blob): Promise<HTMLVideoElement>;
declare type FileType = 'arrayBuffer' | 'file';
export declare function reqMedia(url: string, fileType?: FileType): Promise<ArrayBuffer | Blob>;
export {};
