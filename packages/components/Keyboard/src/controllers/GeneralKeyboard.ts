import KEY_MAP from '../mappings/keyMap';
import KEY_MAP_LIST from '../mappings/keyMapList';
import KEY_TABLE_MAP from '../mappings/keyTableMap';
import KEY_TABLE_LIST from '../mappings/keyTableMapList';

/**
 *  General methods to map and handle keys, and change keyboard mode
 */
class UIGeneralKeyboard {
  /**
   * Define if backspace button should be enabled
   */
  backspaceEnabled = true;

  /**
   * Define if keyboard is alphanumeric or numeric
   */
  alphanumericEnabled = true;

  /**
   * Sets the keyboard to enter numbers only.
   */
  setKeyboardAsNumeric() {
    this.alphanumericEnabled = true;
  }

  /**
   * Sets the keyboard to type alphanumeric characters.
   */
  setKeyboardAsAlphanumeric() {
    this.alphanumericEnabled = false;
  }

  /**
   * Find the key code of given list and key map
   *
   * @param list Key list to find
   * @param map Map object with { keyCode : value }
   * @param keyName Key name to find its code
   * @returns Found key code or `undefined`
   */
  getMappedKeyCode(
    list: string[],
    map: { [key: number]: string | string[] },
    keyName: string,
  ): string | null {
    if (!Array.isArray(list)) return null;

    const found = list.find((code) => {
      const maped: string = map[code];
      if (Array.isArray(maped)) return maped.indexOf(keyName) !== -1;
      if (typeof maped === 'string') return maped.toLowerCase() === keyName.toLowerCase();

      return false;
    });

    return found || null;
  }

  /**
   * Get the key code relative to a specific key name compatible with POS
   * @param keyName Key name
   * @returns Relative key code
   */
  getKeyCode(keyName: string): number | null {
    if (typeof keyName !== 'string') return null;
    const code = this.getMappedKeyCode(KEY_MAP_LIST, KEY_MAP, keyName);
    return code ? Number.parseInt(code, 10) : null;
  }

  /**
   * Get UTF key code relative to a specific key name compatible with POS
   * @param keyName Key name
   * @param inferCharCode IF should infer via UTF table code (String.charCodeAt)
   * @returns Relative key code
   */
  getTableKeyCode(keyName: string, inferCharCode = false): any {
    if (typeof keyName !== 'string') return null;
    let code: string | number | null = this.getMappedKeyCode(
      KEY_TABLE_LIST,
      KEY_TABLE_MAP,
      keyName,
    );

    /**
     * Some key cannot be mapped from POS table, try find it on utf table
     */
    if (!code && inferCharCode === true) {
      code = keyName.charCodeAt(0);
    }

    return code;
  }

  /**
   * Get the key name relative to a specific key code
   * @param keyCode Key code
   * @returns Relative key name
   */
  getKeyName(keyCode: number) {
    const key = KEY_MAP[keyCode];
    if (key) {
      // Draw back to old values
      return String(KEY_MAP[keyCode]).toLowerCase();
    }

    return key;
  }

  /**
   * Check if a certain key is a numeric key
   * @param keyCode Key code
   * @returns
   */
  isNumericKey(keyCode: number): boolean {
    return !Number.isNaN(parseFloat(KEY_MAP[keyCode]));
  }

  /**
   * Check if a certain key is key that have an functionality
   * @param keyCode Key code
   * @returns
   */
  isFunctionKey(keyCode: number): boolean {
    return !this.isNumericKey(keyCode);
  }

  /**
   * Check if a certain key is an action key
   * @param keyCode Key code
   * @deprecated Use `isFunctionKey(keyCode)`
   * @returns
   */
  isActionKey(keyCode: number): boolean {
    return this.isFunctionKey(keyCode);
  }

  /**
   * Return if the backspace button is enabled
   * @returns
   */
  isBackspaceEnabled(): boolean {
    return this.backspaceEnabled;
  }

  /**
   * Switch OFF backspace key
   */
  disableBackspace() {
    this.backspaceEnabled = false;
  }

  /**
   * Switch ON backspace key
   */
  enableBackspace() {
    this.backspaceEnabled = true;
  }
}

export type { UIGeneralKeyboard };

// This is necessary to not duplicate the wrappers code and not create another class instance in order to they stay synchronized with backend config on embeded POS application.
const GeneralKeyboard = new UIGeneralKeyboard();

export default GeneralKeyboard;
