export function createTimeoutPromise(time: number): Promise<void> {
  return new Promise(resolve =>
    setTimeout(() => {
      resolve();
    }, time),
  );
}
export function timeout(time: number): Promise<Error> {
  return new Promise((resolve, reject) => {
    setTimeout(() => reject(new Error(`timeout in ${time} millseconds!`)), time);
  });
}

/**
 * transform seconds to time, eg: 1 => 00:00:01.0, 70 => 00:01:10.0
 * @param sec seconds from video start
 */
export function sec2Time(secs: number): string {
  const sec = secs % 60;
  const min = parseInt( `${secs / 60}`, 10) % 60;
  const hour = parseInt(`${secs / 3600}`, 10);

  return `${padStart(hour.toString())}:${padStart(min.toString())}${padStart(sec.toString())}.0`
}

export function padStart(str: string = '', len: number = 2, val: string = '0') {
  return (Array(len).join(val) + str).slice(-len);
}