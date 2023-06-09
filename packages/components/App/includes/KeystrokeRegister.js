import { KEYBOARD } from '@mamba/core';
import Keyboard from '@mamba/keyboard/api/index.js';

const register = {
  length: 0,
};

/** Return if a certain shortcut key is valid */
export const isEditableInputOnFocus = (target) => {
  const targetEl = target && target !== window.document.body ? target : document.activeElement;
  const isTextInputEl = targetEl.tagName === 'INPUT' || targetEl.tagName === 'TEXTAREA';
  const isEditable = targetEl.disabled !== true && targetEl.readOnly !== true;

  return isTextInputEl && isEditable;
};

export const hasActiveHandlerFor = (key) => {
  const _key = String(key).toLowerCase();
  return !!register[_key] && register[_key].length > 0;
};

export const hasKeystrokeToPrevent = (keyName) => {
  /**
   * Get the element with focus.
   * ! This will only work with focusable elements, (ie: with tabindex = -1 or input)
   */
  // eslint-disable-next-line prefer-destructuring
  const activeElement = document.activeElement;
  const hasTarget = activeElement !== window.document.body;
  const handlerContext = hasTarget ? activeElement : document;
  let prevent = false;

  if (hasTarget) {
    try {
      const keystrokeToFreeze = JSON.parse(activeElement.dataset.freezeKeystrokes);
      if (typeof keystrokeToFreeze === 'boolean') {
        prevent = keystrokeToFreeze;
      }

      if (Array.isArray(keystrokeToFreeze) && keystrokeToFreeze.indexOf(keyName)) {
        prevent = true;
      }
    } catch (e) {
      // do nothing
    }
  }

  return { prevent, handlerContext };
};

const keystrokeHandler = (e) => {
  const keyName = Keyboard.parseEventKeyName(e);

  const keyHandlers = register[keyName];

  // handlerContext: Do not execute keystroke handlers for non global(window target) events
  const { prevent } = hasKeystrokeToPrevent(keyName);

  // Check if we have a editable input with focus
  const isInputOnFocus = isEditableInputOnFocus();

  // prevent back or enter keystrokes to execute simultaneously with on:submit event
  const inputEventOnFocus =
    isInputOnFocus && (keyName === KEYBOARD.KEY_NAMES.BACK || keyName === KEYBOARD.KEY_NAMES.ENTER);

  // foward close event for registered keystrokes
  const inputEventOnClose =
    isInputOnFocus && keyName === KEYBOARD.KEY_NAMES.CLOSE && hasActiveHandlerFor(keyName);

  if (
    (isInputOnFocus && inputEventOnClose) ||
    (!prevent && hasActiveHandlerFor(keyName) && !inputEventOnFocus)
  ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    keyHandlers.forEach((handlers) => {
      if (e.type !== 'keydown') {
        /**
         * Indicates the telemetry event emit action was the type of KEYBOARD, to app consumes.
         */
        e.telemetryEmitType = 'KEYBOARD';
        handlers(e);
      }
    });
  }
};

const listen = () => window.addEventListener('keyup', keystrokeHandler);
const unlisten = () => window.removeEventListener('keyup', keystrokeHandler);

export const addHandler = (key, handler) => {
  if (key) {
    if (!register[key]) {
      if (__DEBUG_LVL__ >= 1) {
        console.log(`[@mamba/app/keystroke] Registering manual keystroke handler for "${key}"`);
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
        console.log(`[@mamba/app/keystroke] Removing manual keystroke handler for "${key}"`);
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
