import { log } from '../../simulator/libs/utils.js';

export const NAMESPACE = 'Keyboard';

/**
 * KeyPress event handler that bypass only numbers
 * @ignore
 * @param  {function} e The KeyPress event
 */
function filterLetters(e) {
  const char = String.fromCharCode(e.charCode || e.which || e.keyCode);

  if (/[a-zA-z]/.test(char)) {
    e.preventDefault();
  }
}

export function setup(Keyboard) {
  /**
   * Sets the keyboard to send only numbers. This will affect the whole application
   * @memberof Keyboard
   */
  Keyboard.setKeyboardAsNumeric = () => {
    if (__DEV__) log('Keyboard is now numeric');
    document.removeEventListener('keypress', filterLetters);
    document.addEventListener('keypress', filterLetters);
  };

  /**
   * Sets the keyboard to send numbers, letters and symbols. This will
   * affect the whole application
   * @memberof Keyboard
   */
  Keyboard.setKeyboardAsAlphanumeric = () => {
    if (__DEV__) log('Keyboard is now alphanumeric');
    document.removeEventListener('keypress', filterLetters);
  };
}
