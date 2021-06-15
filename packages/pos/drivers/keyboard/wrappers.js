import { KEYMAP } from './keymap.js';

export default function(driver) {
  /**
   * Get the key code relative to a specific key name
   * @memberof Keyboard
   * @param {string} keyName - Key name
   * @returns {number} - Relative key code
   */
  driver.getKeyCode = keyName => {
    const keyCode = Object.keys(KEYMAP).find(code => KEYMAP[code] === keyName);
    return keyCode ? Number.parseInt(keyCode, 10) : null;
  };

  /**
   * Get the key name relative to a specific key code
   * @memberof Keyboard
   * @param {number} keyCode - Key code
   * @returns {string} - Relative key name
   */
  driver.getKeyName = keyCode => KEYMAP[keyCode];

  /**
   * Check if a certain key is a numeric key
   * @memberof Keyboard
   * @param {number} keyCode - Key code
   * @returns {boolean}
   */
  driver.isNumericKey = keyCode => !Number.isNaN(parseFloat(KEYMAP[keyCode]));

  /**
   * Check if a certain key is an action key
   * @memberof Keyboard
   * @param {number} keyCode - Key code
   * @returns {boolean}
   */
  driver.isActionKey = keyCode => !driver.isNumericKey(keyCode);

  /**
   * Define if backspace button should be enabled
   */
  let _isBackspaceEnabled = true;

  /**
   * Return if the backspace button is enabled
   * @memberof Keyboard
   * @returns {boolean}
   */
  driver.isBackspaceEnabled = () => _isBackspaceEnabled;

  /**
   * Switch OFF the `isBackspaceEnabled` flag used by the front-end
   * @memberof Keyboard
   */
  driver.disableBackspace = () => {
    _isBackspaceEnabled = false;
  };

  /**
   * Switch ON the `isBackspaceEnabled` flag used by the front-end
   * @memberof Keyboard
   */
  driver.enableBackspace = () => {
    _isBackspaceEnabled = true;
  };
}
