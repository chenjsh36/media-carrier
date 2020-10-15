import axios from 'axios';
const dataTransform = require('../../src/utils/dataTransform');

const { 
  arrayBuffer2Blob,
  arrayBuffer2File,
  blob2ArrayBuffer,
  blob2ObjectURL,
  blob2AudioEelemnt,
  blob2VideoElement,
  reqMedia 
} = dataTransform;

jest.mock('axios');

describe('arrayBuffer2Blob', () => {
  it('size should equal', () => {
    var af = new ArrayBuffer(8);
    var blob = arrayBuffer2Blob(af);

    expect(blob.size).toBe(8);
    expect(blob.type).toBe('');
    expect(blob instanceof Blob).toBe(true);
  })
});

describe('arrayBuffer2File', () => {
  it('file should equal to arrayBuffer', () => {
    var af = new ArrayBuffer(8);
    var file = arrayBuffer2File(af, 'hello.txt', { type: 'text/plain' });

    expect(file.name).toBe('hello.txt');
    expect(file.size).toBe(8);
    expect(file.type).toBe('text/plain');
    expect(file instanceof File).toBe(true);
  })
});

describe('blob2ArrayBuffer', () => {
  it('blob should equal to ArrayBuffer', async () => {
    expect.assertions(2)

    const debug = {hello: "world"};
    const  blob = new Blob([JSON.stringify(debug, null, 2)], {type : 'application/json'});
    const af = await blob2ArrayBuffer(blob);

    expect(af.byteLength).toBe(22);
    expect(af instanceof ArrayBuffer).toBe(true);
  })
});

describe('blob2ObjectURL', () => {
  it('test blob2ObjectURL', () => {
    // JSDON 中 URL 并没有 createObjectURL， 通过 mocking method 来实现
    // see more： https://www.jestjs.cn/docs/manual-mocks#mocking-methods-which-are-not-implemented-in-jsdom
    Object.defineProperty(URL, 'createObjectURL', {
      writable: true,
      value: jest.fn().mockImplementation( blob => 'blob:mockurl')
    })

    const debug = {hello: "world"};
    const  blob = new Blob([JSON.stringify(debug, null, 2)], {type : 'application/json'});

    const url = blob2ObjectURL(blob);
    expect(typeof url).toBe('string');
    expect(/^blob:.*/g.test(url)).toBe(true);
  })
});

describe('blob2AudioEelemnt', () => {
  it('test blob2AudioEelemnt', () => {
    const debug = {hello: "world"};
    const  blob = new Blob([JSON.stringify(debug, null, 2)], {type : 'application/json'});

    const audio = blob2AudioEelemnt(blob);

    expect(audio.tagName).toBe('AUDIO');
  })
})

describe('blob2VideoElement', () => {
  it('test blob2VideoElement', async() => {
    const debug = {hello: "world"};
    const  blob = new Blob([JSON.stringify(debug, null, 2)], {type : 'application/json'});

    const video = blob2VideoElement(blob);

    expect(video.tagName).toBe('VIDEO');
  })
})

describe('reqMedia', () => {
  it('test reqMedia arrayBuffer', async () => {
    const resp = {
      data: new ArrayBuffer(8),
      headers: {
        'content-type': 'video/webm'
      }
    };
    axios.mockResolvedValue(resp);

    const res = await reqMedia('/api/video/1', 'arrayBuffer');
    expect(res.byteLength).toBe(8);
  });

  it('test reqMedia file', async () => {
    const resp = {
      data: new ArrayBuffer(8),
      headers: {
        'content-type': 'video/webm'
      }
    };
    axios.mockResolvedValue(resp);

    const res = await reqMedia('/api/video/1', 'file');
    expect(res.size).toBe(8);
  });
});