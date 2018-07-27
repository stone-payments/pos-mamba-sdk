import Keyboard from '../keyboard.js';

describe('@mambasdk/native/Keyboard', () => {
  it('global Keyboard module should exist', () => {
    expect(window.Keyboard).toBeTruthy();
  });

  it('should have .setKeyboardAsNumeric() method', () => {
    expect(Keyboard.setKeyboardAsNumeric).toEqual(expect.any(Function));
  });
  it('should have .setKeyboardAsAlphanumeric() method', () => {
    expect(Keyboard.setKeyboardAsAlphanumeric).toEqual(expect.any(Function));
  });
});
