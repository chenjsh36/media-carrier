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