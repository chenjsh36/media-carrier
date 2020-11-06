const mpegCommand = require('../../src/utils/mpegCommand');

const { getClipCommand } = mpegCommand;

describe('getClipCommand', () => {
  it('test getClipCommand with start|end time', () => {
    const startTime = '00:00:01.0';
    const endTime = '00:00:10.0';
    const formatType = 'mp4';
    const arrayBuffer = new ArrayBuffer(151721);
    const res = getClipCommand({
      arrayBuffer,
      startTime,
      endTime,
      formatType,
    });
    expect(res.type).toBe('run');
    expect(res.arguments).toEqual(`-ss ${startTime} -to ${endTime} -accurate_seek -i input.${formatType} -c copy -avoid_negative_ts 1 output.${formatType}`.split(' '));
    expect(res.MEMFS[0].data).toEqual(arrayBuffer);
    expect(res.MEMFS[0].name).toBe(`input.${formatType}`);
  })
  
  it('test getClipCommand with start|duration time', () => {
    // todo
    const startTime = '00:00:01.0';
    const duration = '00:00:10.0';
    const formatType = 'mp4';
    const arrayBuffer = new ArrayBuffer(151721);
    const res = getClipCommand({
      arrayBuffer,
      startTime,
      duration,
      endTime: '00:00:02.0',
      formatType,
    });
    expect(res.type).toBe('run');
    expect(res.arguments).toEqual(`-ss ${startTime} -t ${duration} -accurate_seek -i input.${formatType} -c copy -avoid_negative_ts 1 output.${formatType}`.split(' '));
    expect(res.MEMFS[0].data).toEqual(arrayBuffer);
    expect(res.MEMFS[0].name).toBe(`input.${formatType}`);
  })
  
  it('test getClipCommand without endTime and duration', () => {
    // todo
    const startTime = '00:00:01.0';
    const formatType = 'mp4';
    const arrayBuffer = new ArrayBuffer(151721);
    const res = getClipCommand({
      arrayBuffer,
      startTime,
      formatType,
    });
    expect(res.type).toBe('run');
    expect(res.arguments).toEqual(`-ss ${startTime} -accurate_seek -i input.${formatType} -c copy -avoid_negative_ts 1 output.${formatType}`.split(' '));
    expect(res.MEMFS[0].data).toEqual(arrayBuffer);
    expect(res.MEMFS[0].name).toBe(`input.${formatType}`);
  })
})