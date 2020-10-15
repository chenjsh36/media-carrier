import 'jsdom-worker'
const mpegWorker = require('../../src/utils/mpegWorker');

const {
  createWorker,
  pmToPromiseWithProgress,
  pmToPromise,
  waitForWorkerIsReady,
} = mpegWorker;

describe('createWorker', () => {
  // 解决 jest 不支持 worker 的方法，看下 https://github.com/developit/jsdom-worker 是否有帮助
  test('test createWorker', (done) => {
    // const worker = createWorker('/test.js');
    const workerCode = `self.onmessage = e => {postMessage(e.data*2)}`;
    const workerUrl = URL.createObjectURL(new Blob([workerCode]));
    const worker = createWorker(workerUrl);
    worker.onmessage = jest.fn(() => true);
    worker.postMessage(5);

    // onmessage 的调用是异步的，延后 2s 再做测试，这个方式不一定准，遇到机器差的情况，两秒延时不一定足够，看有没有其他解决方法。
    setTimeout(() => {
      expect(worker.onmessage).toHaveBeenCalled();
      expect(worker.onmessage).toHaveBeenCalledWith({ data: 10 });
      done();
    }, 2000)
  }, 4000)
});

describe('pmToPromiseWithProgress', () => {
  it('test pmToPromiseWithProgress', async () => {
    const workerCode = `
    self.onmessage = function(e) {
      let count = -1; 
      function step() {
        setTimeout(function() {
          count++;
          if (count === 0) {
            postMessage({ type: 'start' })          
            step();
          } else if (count < 10) {
            postMessage({ type: 'stdout', currentTime: '00:00:01.0', duration: '00:00:09.0', data: '' });
            step();
          } else {
            postMessage({ type: 'done', currentTime: '00:00:09.0', duration: '00:00:09.0', data: '' });
          }
        }, 200)
      }
      step();
    }`;
    const workerUrl = URL.createObjectURL(new Blob([workerCode]));
    const worker = createWorker(workerUrl);
    worker.onmessage = jest.fn(() => true);

    const postInfo = {
      type: 'run',
      arguments: [],
      MEMFS: []
    };
    const progressCallback = jest.fn(({
      progress,
      currentTime,
      duration
    }) => {
      return { progress, currentTime, duration };
    })
    const res = await pmToPromiseWithProgress(
      worker,
      postInfo,
      progressCallback
    )

    expect(worker.onmessage).toHaveBeenCalled();
    expect(progressCallback).toHaveBeenCalledTimes(10);
  })
});
describe('pmToPromise', () => {
  it('test pmToPromiseWithProgress', async () => {
    const workerCode = `
    self.onmessage = function(e) {
      postMessage({type: 'done', data: ''});
    }`;
    const workerUrl = URL.createObjectURL(new Blob([workerCode]));
    const worker = createWorker(workerUrl);
    worker.onmessage = jest.fn(() => true);

    const postInfo = {
      type: 'run',
      arguments: [],
      MEMFS: [{}]
    };
    const res = await pmToPromise(
      worker,
      postInfo
    )

    expect(worker.onmessage).toHaveBeenCalled();
    expect(res.logs.length).toEqual(1);
  })
});
describe('waitForWorkerIsReady', () => {
  test('test waitForWorkerIsReady ok', async () => {
    const workerCode = `
    self.onmessage = function(e) {
      postMessage({type: 'ready', data: ''});
    }`;
    const workerUrl = URL.createObjectURL(new Blob([workerCode]));
    const worker = createWorker(workerUrl);
    worker.onmessage = jest.fn(() => true);

    const onSuccess = jest.fn(() => true);
    worker.postMessage({});
    const res = await waitForWorkerIsReady(
      worker,
      onSuccess,
    )
    expect(res).toBe(undefined);
    expect(worker.onmessage).toHaveBeenCalled();
    expect(onSuccess).toHaveBeenCalled();
  })
});