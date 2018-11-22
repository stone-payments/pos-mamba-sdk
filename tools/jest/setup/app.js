import Keyboard from '@mamba/pos/api/keyboard.js';
import TestApp from '../__mocks__/TestApp.html';

let lastTestApp;

global.newTestApp = (destroyLast = true) => {
  if (destroyLast && lastTestApp) lastTestApp.destroy();

  lastTestApp = new TestApp({
    target: document.body,
  });

  lastTestApp.target = lastTestApp.options.target;

  return lastTestApp;
};

global.clickOn = (el, opts = {}) => {
  el.dispatchEvent(
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window,
      ...opts,
    }),
  );
};

global.fireKey = keyName => {
  window.dispatchEvent(
    new KeyboardEvent('keydown', {
      keyCode: Keyboard.getKeyCode(keyName),
      bubbles: true,
      cancelable: false,
    }),
  );

  window.dispatchEvent(
    new KeyboardEvent('keyup', {
      keyCode: Keyboard.getKeyCode(keyName),
      bubbles: true,
      cancelable: false,
    }),
  );
};
