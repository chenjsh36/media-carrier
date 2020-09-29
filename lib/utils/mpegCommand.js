export function getClipCommand(_a) {
    var arrayBuffer = _a.arrayBuffer, startTime = _a.startTime, endTime = _a.endTime, formatType = _a.formatType;
    var command = {
        type: 'run',
        arguments: ("-ss " + startTime + " -t " + endTime + " -accurate_seek -i input." + formatType + " -c copy -avoid_negative_ts 1 output." + formatType).split(' '),
        MEMFS: [
            {
                // data: new Uint8Array(arrayBuffer as any),
                data: arrayBuffer,
                name: "input." + formatType,
            },
        ],
    };
    return command;
}
//# sourceMappingURL=mpegCommand.js.map