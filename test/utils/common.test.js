const common = require('../../src/utils/common');

const { sec2Time, time2Sec, time2Millisecond, padStart, timeout, createTimeoutPromise } = common;

test('sec2Time', () => {
  expect(() => sec2Time(-1)).toThrowError(new Error('"secs" should be positive integer'))
  expect(sec2Time(1)).toBe('00:00:01.0');
  expect(sec2Time(0)).toBe('00:00:00.0');
  expect(sec2Time(60)).toBe('00:01:00.0');
  expect(sec2Time(3600)).toBe('01:00:00.0');
  expect(sec2Time(360000)).toBe('100:00:00.0');
})

test('padStart', () => {
  expect(padStart('1', 2, '0')).toBe('01');
  expect(padStart('10', 2, '0')).toBe('10');
  expect(padStart('1', 3, '#')).toBe('##1');
  expect(padStart('100', 2, '0', true)).toBe('00');
  expect(padStart('100', 2, '0', false)).toBe('100');
})

it('time2Sec', () => {
  expect(time2Sec('00:00:01.0')).toBe(1);
  expect(time2Sec('00:00:00.0')).toBe(0);
  expect(time2Sec('00:01:00.0')).toBe(60);
  expect(time2Sec('01:00:00.0')).toBe(3600);
})
it('time2Millisecond', () => {
  expect(time2Millisecond('00:00:01.0')).toBe(1000);
  expect(time2Millisecond('00:00:00.0')).toBe(0);
  expect(time2Millisecond('00:01:00.0')).toBe(60000);
  expect(time2Millisecond('01:00:00.0')).toBe(3600000);
})

it('timeout', async () => {
  expect.assertions(1);
  const time  = 1000;
  // 方法1： 通过 try catch
  // try {
  //   await timeout(time);    
  // } catch(e) {
  //   expect(e).toEqual(new Error(`timeout in ${time} millseconds!`))
  // }

  // 方法 3 通过 .rejects 
  await expect(timeout(time)).rejects.toEqual(new Error(`timeout in ${time} millseconds!`))
})

it('createTimeoutPromise', async () => {
  expect.assertions(1);
  const time  = 1000;
  await expect(createTimeoutPromise(time)).resolves.toEqual(undefined);
})
