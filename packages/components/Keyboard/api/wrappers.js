import { GeneralKeyboard } from '../lib/index.js';

const getKeyboardInstance = () => {
  return window.MambaKeyboardInstance && window.MambaKeyboardInstance.instance;
};

export default function (driver) {
  // Add virtual keyboard dummy functions for preventing its misuse and broke some code. (Just some most used)
  // The full list is at `packages/components/Keyboard/src/Keyboard.ts:~889` (bindToDriver method)
  const notInitialized = () =>
    __DEV__ && console.error('The virtual keyboard was not initialized! Your method did nothing.');
  if (!driver.setKeyboardType) driver.setKeyboardType = notInitialized;
  if (!driver.setOptions) driver.setOptions = notInitialized;
  if (!driver.show) driver.show = notInitialized;
  if (!driver.hide) driver.hide = notInitialized;
  if (!driver.unmount) driver.unmount = notInitialized;
  if (!driver.reset) driver.reset = notInitialized;
  if (!driver.shouldUpdateKeyboardView) driver.shouldUpdateKeyboardView = notInitialized;
  if (!driver.destroy) driver.destroy = notInitialized;
  if (!driver.updateSoundEnabledState) driver.updateSoundEnabledState = notInitialized;

  // Original Keyboard methods
  const $KeyboardSetAsAlphanumeric = driver.setKeyboardAsAlphanumeric;

  const $KeyboardSetAsNumeric = driver.setKeyboardAsNumeric;

  /**
   * Sets the keyboard to enter numbers only.
   */
  driver.setKeyboardInputAsNumeric = () => {
    GeneralKeyboard.setKeyboardAsNumeric();
    $KeyboardSetAsNumeric();
  };

  /**
   * Sets the keyboard to type alphanumeric characters.
   */
  driver.setKeyboardInputAsAlphanumeric = () => {
    GeneralKeyboard.setKeyboardAsAlphanumeric();
    $KeyboardSetAsAlphanumeric();
  };

  /**
   * Sets the keyboard to enter numbers only.
   * @deprecated use `setKeyboardInputAsNumeric`
   */
  driver.setKeyboardAsNumeric = driver.setKeyboardInputAsNumeric;

  /**
   * Sets the keyboard to type alphanumeric characters.
   * @deprecated use `setKeyboardInputAsAlphanumeric`
   */
  driver.setKeyboardAsAlphanumeric = driver.setKeyboardInputAsAlphanumeric;

  /**
   * Keyboard instance shortcut.
   */
  Object.defineProperty(driver, 'virtualKeyboard', {
    get() {
      return getKeyboardInstance();
    },
    configurable: true, // Make it possible to configure every time.
    enumerable: true,
  });

  /**
   * Rewrite driver get/set of keyboard visibility
   */
  Object.defineProperty(driver, 'visibility', {
    configurable: true,
    get() {
      const _keyboard = getKeyboardInstance();
      if (_keyboard) return _keyboard.visibility;
      return undefined;
    },
    set(value) {
      const _keyboard = getKeyboardInstance();
      if (_keyboard) {
        _keyboard.visibility = value;
      }
    },
  });

  /**
   * Find the key code of given list and key map
   * @param {string[]} list Key list to find
   * @param {{ [key: number]: string }} map Map object with { keyCode : value }
   * @param {string} keyName  Key name to find its code
   * @returns {number | null} Found key code or `null`
   */
  driver.getMappedKeyCode = GeneralKeyboard.getMappedKeyCode;

  /**
   * Find the key name of given list and map for an KeyboardEvent
   * @param {number} keyCode  Key code to find its code
   * @param {{ shiftKey: boolean }} modifiers Keyboard event modifierds
   * @returns {number | null} Found key name or `null`
   */
  driver.getEventMappedKeyName = GeneralKeyboard.getEventMappedKeyName;

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
   * Get the mamba normalized key code from user input event
   * @memberof GeneralKeyboard
   * @param {KeyboardEvent} event - Key code
   * @returns {any} - Relative key name
   */
  driver.parseEventKeyCode = GeneralKeyboard.parseEventKeyCode;

  /**
   * Get the mamba normalized key name from user input event
   * @memberof GeneralKeyboard
   * @param {KeyboardEvent} event - Key code
   * @returns {any} - Relative key name
   */
  driver.parseEventKeyName = GeneralKeyboard.parseEventKeyName;

  /**
   * Get the mamba normalized key code and name from user input event
   * @param {KeyboardEvent} event User input event
   * @returns {[string | number | undefined, string | number | undefined]}A tuple containing the key code and key name respectively. Ex.: [13, "enter"]
   */
  driver.parseEventKeys = GeneralKeyboard.parseEventKeys;

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
