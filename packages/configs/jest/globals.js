import Keyboard from '@mamba/pos/api/keyboard.js';

/** Mock the scrollTo fn */
Element.prototype.scrollTo = function noop() {};

/** Dispatch a click event on a dom node */
const MOUSE_EVENTS = ['mousedown', 'mouseup', 'click'];

/** Dispatch a click event on a dom node */
global.clickOn = (el, opts = {}) => {
  MOUSE_EVENTS.forEach((event) =>
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

  KEYBOARD_EVENTS.forEach((event) =>
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
  keys.forEach((key) => {
    el.value += key;
    global.fireKey(el, key);
  });
};
