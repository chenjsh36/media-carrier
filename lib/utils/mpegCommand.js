export function getClipCommand(_a) {
    var arrayBuffer = _a.arrayBuffer, startTime = _a.startTime, duration = _a.duration, endTime = _a.endTime, formatType = _a.formatType;
    // 当 duration 和 endTime 同时传入时，优先 duration
    var tOrTo = duration !== undefined ? "-t " + duration : (endTime !== undefined ? "-to " + endTime : '');
    var command = {
        type: 'run',
        arguments: ("-ss " + startTime + " " + tOrTo + " -accurate_seek -i input." + formatType + " -c copy -avoid_negative_ts 1 output." + formatType).replace(/[ ]+/g, ' ').split(' '),
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