import { GeneralKeyboard } from '../lib/index.js';

const getKeyboardInstance = () => {
  return window.MambaKeyboardInstance && window.MambaKeyboardInstance.instance;
};

export default function (driver) {
  // Original Keyboard methods
  const $KeyboardSetAsAlphanumeric = driver.setKeyboardAsAlphanumeric;

  const $KeyboardSetAsNumeric = driver.setKeyboardAsNumeric;

  /**
   * Sets the keyboard to enter numbers only.
   */
  driver.setKeyboardInputAsNumeric = () => {
    GeneralKeyboard.setKeyboardAsNumeric();
    $KeyboardSetAsAlphanumeric();
  };

  /**
   * Sets the keyboard to type alphanumeric characters.
   */
  driver.setKeyboardInputAsAlphanumeric = () => {
    GeneralKeyboard.setKeyboardAsAlphanumeric();
    $KeyboardSetAsNumeric();
  };

  /**
   * Sets the keyboard to enter numbers only.
   * @deprecated
   */
  driver.setKeyboardAsNumeric = driver.setKeyboardInputAsNumeric;

  /**
   * Sets the keyboard to type alphanumeric characters.
   * @deprecated
   */
  driver.setKeyboardAsAlphanumeric = driver.setKeyboardInputAsAlphanumeric;

  /**
   * Keyboard instance shortcut.
   */
  Object.defineProperty(driver, 'virtualKeyboard', {
    get() {
      return getKeyboardInstance();
    },
    configurable: true,
    enumerable: true,
  });

  /**
   * Find the key code of given list and key map
   * @param {string[]} list Key list to find
   * @param {{ [key: number]: string }} map Map object with { keyCode : value }
   * @param {string} keyName  Key name to find its code
   * @returns {number | null} Found key code or `undefined`
   */
  driver.getMappedKeyCode = GeneralKeyboard.getMappedKeyCode;

  /**
   * Get the key code relative to a specific key name
   * @memberof GeneralKeyboard
   * @param {string} keyName - Key name
   * @returns {number} - Relative key code
   */
  driver.getKeyCode = GeneralKeyboard.getKeyCode;

  /**
   * Get UTF key code relative to a specific key name compatible with POS
   * @memberof GeneralKeyboard
   * @param {string} keyName Key name
   * @param {number} inferCharCode IF should infer via UTF table code (String.charCodeAt)
   * @returns {number} Relative key code
   */
  driver.getTableKeyCode = GeneralKeyboard.getTableKeyCode;

  /**
   * Get the key name relative to a specific key code
   * @memberof GeneralKeyboard
   * @param {number} keyCode - Key code
   * @returns {string} - Relative key name
   */
  driver.getKeyName = GeneralKeyboard.getKeyName;

  /**
   * Check if a certain key is a numeric key
   * @memberof GeneralKeyboard
   * @param {number} keyCode - Key code
   * @returns {boolean}
   */
  driver.isNumericKey = GeneralKeyboard.isNumericKey;

  /**
   * Check if a certain key is an action key
   * @memberof GeneralKeyboard
   * @param {number} keyCode - Key code
   * @returns {boolean}
   */
  driver.isFunctionKey = GeneralKeyboard.isFunctionKey;

  /**
   * Check if a certain key is an action key
   * @memberof GeneralKeyboard
   * @param {number} keyCode - Key code
   * @deprecated Use `isFunctionKey(keyCode)`
   * @returns {boolean}
   */
  driver.isActionKey = GeneralKeyboard.isActionKey;

  /**
   * Return if the backspace button is enabled
   * @memberof GeneralKeyboard
   * @returns {boolean}
   */
  driver.isBackspaceEnabled = GeneralKeyboard.isBackspaceEnabled;

  /**
   * Switch OFF backspace key
   * @memberof GeneralKeyboard
   */
  driver.disableBackspace = GeneralKeyboard.disableBackspace;

  /**
   * Switch ON backspace key
   * @memberof GeneralKeyboard
   */
  driver.enableBackspace = GeneralKeyboard.enableBackspace;
}
