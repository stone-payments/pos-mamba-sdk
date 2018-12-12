import Keyboard from '@mamba/pos/api/keyboard.js';

const register = {
  length: 0,
};

export const hasActiveHandlerFor = key =>
  !!register[key] && register[key].length > 0;

const keystrokeHandler = e => {
  const keyName = Keyboard.getKeyName(e.charCode || e.which || e.keyCode);
  const keyHandlers = register[keyName];

  if (hasActiveHandlerFor(keyName)) {
    e.preventDefault();
    e.stopImmediatePropagation(); // prevent the <App /> key up event from firing

    keyHandlers.forEach(handlers => handlers(e));
  }
};

const listen = () => window.addEventListener('keyup', keystrokeHandler);
const unlisten = () => window.removeEventListener('keyup', keystrokeHandler);

export const addHandler = (key, handler) => {
  if (key) {
    if (!register[key]) {
      if (__DEBUG_LVL__ >= 1) {
        console.log(
          `[@mamba/app/keystroke] Registering manual keystroke handler for "${key}"`,
        );
      }
      register[key] = [];

      /** First key in the register, let's start listening */
      if (++register.length === 1) {
        listen();
      }
    }
    register[key].push(handler);
  }
};

export const removeHandler = (key, handler) => {
  if (key && register[key]) {
    const index = register[key].indexOf(handler);
    if (index > -1) {
      register[key].splice(index, 1);
      if (__DEBUG_LVL__ >= 1) {
        console.log(
          `[@mamba/app/keystroke] Removing manual keystroke handler for "${key}"`,
        );
      }

      if (register[key].length === 0) {
        delete register[key];
      }
    }

    /** Was the last key on the register, let's unlisten */
    if (--register.length === 0) {
      unlisten();
    }
  }
};
