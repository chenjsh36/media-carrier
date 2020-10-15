const utils = require('../../src/utils');

describe('utils', () => {
  it('test utils', () => {
    expect(utils).toHaveProperty('mpegWorker');
    expect(utils).toHaveProperty('mpegCommand');
    expect(utils).toHaveProperty('dataTransform');
    expect(utils).toHaveProperty('common');
  })
})