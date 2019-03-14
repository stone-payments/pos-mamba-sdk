import * as Utils from '../index.js';

describe('Utilities index', () => {
  it('should have a "Money" property with the money related utilities', () => {
    expect(typeof Utils.Money).toBe('object');
    expect(typeof Utils.Money.format).toBe('function');
    expect(typeof Utils.Money.padZero).toBe('function');
    expect(typeof Utils.Money.floor).toBe('function');
    expect(typeof Utils.Money.round).toBe('function');
    expect(typeof Utils.Money.ceil).toBe('function');
  });

  it('should have a "nextTick" direct property', () => {
    expect(typeof Utils.timeout).toBe('function');
  });
});
