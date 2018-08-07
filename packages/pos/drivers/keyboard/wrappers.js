/**
 * KeyCode <-> KeyName dictionary
 */
const KEYMAP = Object.freeze({
  13: 'enter',
  8: 'back',
  27: 'close',
  17: 'help',
  16: 'shortcuts',
  48: '0',
  49: '1',
  50: '2',
  51: '3',
  52: '4',
  53: '5',
  54: '6',
  55: '7',
  56: '8',
  57: '9',
});
/**
 * Get the key code relative to a specific key name
 * @memberof Keyboard
 * @param {string} keyName - Key name
 * @returns {number} - Relative key code
 */
function getKeyCode(keyName) {
  return Object.keys(KEYMAP).find(code => KEYMAP[code] === keyName);
}

/**
 * Get the key name relative to a specific key code
 * @memberof Keyboard
 * @param {number} keyCode - Key code
 * @returns {string} - Relative key name
 */
function getKeyName(keyCode) {
  return KEYMAP[keyCode];
}

/**
 * Check if a certain key is a numeric key
 * @memberof Keyboard
 * @param {number} keyCode - Key code
 * @returns {boolean}
 */
function isNumericKey(keyCode) {
  return !Number.isNaN(parseFloat(KEYMAP[keyCode]));
}

/**
 * Check if a certain key is an action key
 * @memberof Keyboard
 * @param {number} keyCode - Key code
 * @returns {boolean}
 */
function isActionKey(keyCode) {
  return !isNumericKey(keyCode);
}

/**
 * Define if backspace button should be enabled
 */
let _isBackspaceEnabled = true;

/**
 * Return if the backspace button is enabled
 * @memberof Keyboard
 * @returns {boolean}
 */
function isBackspaceEnabled() {
  return _isBackspaceEnabled;
}

/**
 * Switch OFF the `isBackspaceEnabled` flag used by the front-end
 * @memberof Keyboard
 */
function disableBackspace() {
  _isBackspaceEnabled = false;
}

/**
 * Switch ON the `isBackspaceEnabled` flag used by the front-end
 * @memberof Keyboard
 */
function enableBackspace() {
  _isBackspaceEnabled = true;
}

export default function(driver) {
  Object.assign(driver, {
    getKeyCode,
    getKeyName,
    isNumericKey,
    isActionKey,
    isBackspaceEnabled,
    disableBackspace,
    enableBackspace,
  });
}
