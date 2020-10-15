interface ICommand {
    type: string;
    arguments: string[];
    MEMFS: [
        {
            data: Uint8Array | ArrayBuffer;
            name: string;
        }
    ];
}
export declare function getClipCommand({ arrayBuffer, startTime, duration, endTime, formatType }: {
    arrayBuffer: ArrayBuffer;
    startTime: string;
    duration?: string;
    endTime?: string;
    formatType: string;
}): ICommand;
export {};
