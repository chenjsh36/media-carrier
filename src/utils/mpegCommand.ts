interface ICommand {
  type: string;
  arguments: string[];
  MEMFS: [
    {
      data: Uint8Array | ArrayBuffer;
      name: string;
    }
  ]
}

export function getClipCommand({ arrayBuffer, startTime, duration, endTime, formatType }: {
  arrayBuffer: ArrayBuffer;
  startTime: string;
  duration?: string;
  endTime?: string;
  formatType: string;
}): ICommand {
  // 当 duration 和 endTime 同时传入时，优先 duration
  const tOrTo = duration !== undefined ? `-t ${duration}` : (endTime !== undefined ? `-to ${endTime}` : '');
  const command: ICommand = {
    type: 'run',
    arguments: `-ss ${startTime} ${tOrTo} -accurate_seek -i input.${formatType} -c copy -avoid_negative_ts 1 output.${formatType}`.replace(/[ ]+/g, ' ').split(' '),
    MEMFS: [
      {
        // data: new Uint8Array(arrayBuffer as any),
        data: arrayBuffer,
        name: `input.${formatType}`,
      },
    ],
  };
  return command;
}
