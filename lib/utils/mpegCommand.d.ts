interface ICommand {
    type: string;
    arguments: string[];
    MEMFS: [
        {
            data: Uint8Array;
            name: string;
        }
    ];
}
export declare function getClipCommand({ arrayBuffer, startTime, endTime, formatType }: {
    arrayBuffer: ArrayBuffer;
    startTime: string;
    endTime: string;
    formatType: string;
}): ICommand;
export {};
