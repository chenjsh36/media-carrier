export interface IWorkerEvent {
    data: {
        type: string;
        data: {
            MEMFS: {
                data: ArrayBuffer;
            }[];
        };
    };
}
export interface IPostInfo {
    type: string;
    arguments: string[];
    MEMFS: any[];
}
export interface IProgressCallback {
    (params: {
        progress: number;
        duration: number;
        currentTime: number;
    }): void;
}
export declare function createWorker(path: string): Worker;
export declare function pmToPromiseWithProgress(worker: Worker, postInfo?: IPostInfo, progressCallback?: IProgressCallback): Promise<{
    buffer: ArrayBuffer;
    logs: string[];
}>;
export declare function pmToPromise(worker: Worker, postInfo?: IPostInfo, key?: string): Promise<{
    buffer: ArrayBuffer | string;
    logs: string[];
}>;
export declare function waitForWorkerIsReady(worker: Worker, onSuccess?: Function, onFail?: Function): Promise<any>;
