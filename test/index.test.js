import 'jsdom-worker';
import MediaCarrier from '../src/index';


describe('MediaCarrier', () => {
  let mc = null;
  beforeEach(() => {
    mc = new MediaCarrier({ timeout: 1000 });
  })
  afterEach(() => {
    mc = null;
  })
  it('test Class Properties ', () => {
    expect(mc.timeout).toBe(1000);
    expect(mc).toHaveProperty('id');
    expect(mc).toHaveProperty('open');
    expect(mc).toHaveProperty('close');
    expect(mc).toHaveProperty('clip');
    expect(mc).toHaveProperty('withoutPresetClip');
    expect(mc).toHaveProperty('mediaSpaceClip');
    expect(mc).toHaveProperty('md5');
  })
  it('test worker ready', async () => {
    let sc = jest.fn(() => true);
    const workerCode = `postMessage({ type: 'ready'})`;
    const workerUrl = URL.createObjectURL(new Blob([workerCode]));
    const ret = await mc.open({
      workerPath: workerUrl,
      onSuccess: sc,
    });
    expect(sc).toHaveBeenCalled();
  })

  it('test worker clip', async() => {
    let sc = jest.fn(() => true);
    const workerCode = `postMessage({ type: 'ready'}); self.onmessage=() => {
      postMessage({ type: 'done'});
    }`;
    const workerUrl = URL.createObjectURL(new Blob([workerCode]));
    await mc.open({
      workerPath: workerUrl,
      onSuccess: sc,
    });
    const file = new Blob([JSON.stringify({name: 'jiansheng.chen'})], { type: 'application/json'});
    const res = await mc.clip(file, { formatType: 'mp4' });
    expect(res.arrayBuffer).toBe(null);
  })

  it('test worker md5', async() => {
    let sc = jest.fn(() => true);
    const workerCode = `postMessage({ type: 'ready'}); self.onmessage=() => {
      postMessage({ type: 'done'});
    }`;
    const workerUrl = URL.createObjectURL(new Blob([workerCode]));
    await mc.open({
      workerPath: workerUrl,
      onSuccess: sc,
    });
    const file = new Blob([JSON.stringify({name: 'jiansheng.chen'})], { type: 'application/json'});
    const res = await mc.md5(file, { formatType: 'mp4' });

    expect(res).toEqual({ md5: null, logs: [[""]]})
  })
})