import Keyboard from '@mamba/pos/api/keyboard.js';
import TestApp from '../__mocks__/TestApp.html';

let lastTestApp;

/* Create a new app root for testing */
global.newTestRoot = ({ unique = true } = {}) => {
  if (unique && lastTestApp) lastTestApp.destroy();

  lastTestApp = new TestApp({ target: document.body });

  lastTestApp.target = lastTestApp.options.target;

  return lastTestApp;
};

/** Dispatch a clcik event on a dom node */
const MOUSE_EVENTS = ['mousedown', 'mouseup', 'click'];

global.clickOn = (el, opts = {}) => {
  MOUSE_EVENTS.forEach(event =>
    el.dispatchEvent(
      new MouseEvent(event, {
        bubbles: true,
        cancelable: true,
        view: window,
        ...opts,
      }),
    ),
  );
};

/** Dispatch key events on the window */
const KEYBOARD_EVENTS = ['keydown', 'keypress', 'input', 'keyup'];

global.fireKey = (el, keyName) => {
  if (typeof el === 'string') {
    keyName = el;
    el = window;
  }

  KEYBOARD_EVENTS.forEach(event =>
    el.dispatchEvent(
      new KeyboardEvent(event, {
        keyCode: Keyboard.getKeyCode(keyName),
        bubbles: true,
        cancelable: false,
      }),
    ),
  );
};
/** typeOn(element, 'things to type') */
global.typeOn = (el, keys) => {
  if (el.focus && document.activeElement !== el && el !== window) {
    el.focus();
  }

  keys = keys.split('');
  keys.forEach(key => {
    el.value += key;
    global.fireKey(el, key);
  });
};
