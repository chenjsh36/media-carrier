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
 * transform seconds to time, eg: 1 => "00:00:01.0", 70 => "00:01:10.0"
 * @param sec seconds from video start
 */
export function sec2Time(secs: number): string {
  if (secs < 0) {
    throw new Error('"secs" should be positive integer');
  }
  const sec = secs % 60;
  const min = parseInt( `${secs / 60}`, 10) % 60;
  const hour = parseInt(`${secs / 3600}`, 10);

  return `${padStart(hour.toString(), 2, '0', false)}:${padStart(min.toString())}:${padStart(sec.toString())}.0`
}

/**
 * transform time to milliseconds, eg: "00:00:01" => 1
 * @param time 'hh:mm:ss.x'
 */
export function time2Sec(time: string): number {
  return parseInt((time2Millisecond(time) / 1000).toString(), 10);
}

/**
 * transform time to milliseconds, eg: "00:00:01" => 1000
 * @param time 'hh:mm:ss.x'
 */
export function time2Millisecond(time: string): number {
  const [hour, minute, second] = time.split(':').map(str => parseFloat(str));
  let millisecond = 0;
  millisecond += second * 1000;
  millisecond += minute * 60 * 1000;
  millisecond += hour * 60 * 60 * 1000;
  return millisecond;
}

/**
 * like es7 <string>.padStart
 * @param str
 * @param len
 * @param val
 * @param isFreezeLen
 */
export function padStart(str: string = '', len: number = 2, val: string = '0', isFreezeLen: boolean = true) {
  if (isFreezeLen === false && str.length >= len) {
    return str;
  }
  return (Array(len).join(val) + str).slice(-len);
}

export function getVideoDuration(video: File): Promise<number> {
  return new Promise((resolve) => {
    let videoElement = document.createElement('video');
    videoElement.preload = 'metadata';
    videoElement.addEventListener('loadedmetadata', () => {
      window.URL.revokeObjectURL(videoElement.src);
      const duration = videoElement.duration;
      videoElement = null;
      resolve(duration);
    })
    videoElement.src = window.URL.createObjectURL(video);
  })
}