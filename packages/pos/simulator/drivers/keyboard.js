import { Registry } from '../index.js';
import { log } from '../libs/utils.js';

export const NAMESPACE = '$Keyboard';

export const SETTINGS = {
  isAlphanumericEnabled: false,
};

/**
 * KeyPress event handler that bypass only numbers
 * @ignore
 * @param  {function} e The KeyPress event
 */
function filterLetters(e) {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
    const char = String.fromCharCode(e.charCode || e.which || e.keyCode);

    if (/[a-zA-z]/.test(char)) {
      e.preventDefault();
    }
  }
}

export function setup(Keyboard) {
  /**
   * Sets the keyboard to send only numbers. This will affect the whole application
   * @memberof Keyboard
   */
  Keyboard.setKeyboardAsNumeric = () => {
    if (__DEBUG_LVL__ >= 1) log('Keyboard is now numeric');

    Registry.set((draft) => {
      draft.$Keyboard.isAlphanumericEnabled = false;
    });

    const root = document.querySelector('.mamba-app-container') || window;
    root.removeEventListener('keypress', filterLetters);
    root.addEventListener('keypress', filterLetters);
  };

  /**
   * Sets the keyboard to send numbers, letters and symbols. This will
   * affect the whole application
   * @memberof Keyboard
   */
  Keyboard.setKeyboardAsAlphanumeric = () => {
    if (__DEBUG_LVL__ >= 1) log('Keyboard is now alphanumeric');

    Registry.set((draft) => {
      draft.$Keyboard.isAlphanumericEnabled = true;
    });

    const root = document.querySelector('.mamba-app-container') || window;
    root.removeEventListener('keypress', filterLetters);
  };
}
