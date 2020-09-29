interface ICommand {
  type: string;
  arguments: string[];
  MEMFS: [
    {
      data: Uint8Array;
      name: string;
    }
  ]
}

export function getClipCommand({ arrayBuffer, startTime, endTime, formatType }: {
  arrayBuffer: ArrayBuffer,
  startTime: string,
  endTime: string,
  formatType: string,
}): ICommand {
  const command: ICommand = {
    type: 'run',
    arguments: `-ss ${startTime} -t ${endTime} -accurate_seek -i input.${formatType} -c copy -avoid_negative_ts 1 output.${formatType}`.split(' '),
    MEMFS: [
      {
        // data: new Uint8Array(arrayBuffer as any),
        data: arrayBuffer as any,
        name: `input.${formatType}`,
      },
    ],
  };
  return command;
}