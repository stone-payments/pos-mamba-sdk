import { timeout } from '../ui.js';

describe('timeout', () => {
  it('should return a promise', () => {
    expect(typeof timeout().then).toBe('function');
  });

  it('should accept a delay as parameter', async () => {
    const init = new Date();
    await timeout(500);
    const end = new Date();
    expect(end - init).toBeGreaterThan(490);
  });
});
