import KEY_MAP from '../mappings/keyMap';
import KEY_LIST from '../mappings/keyCodeList';
/**
 * Responsible for the output of physical keys
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
   * Get the key code relative to a specific key name
   * @param keyName Key name
   * @returns Relative key code
   */
  getKeyCode(keyName: string) {
    if (typeof keyName !== 'string') return '';

    const found = KEY_LIST.find((code) => {
      const maped = KEY_MAP[code];
      if (typeof maped === 'string') {
        // normalize names between browser versions
        return maped.toLowerCase() === keyName.toLowerCase();
      }
      return false;
    });

    return found ? Number.parseInt(found, 10) : null;
  }

  /**
   * Get the key name relative to a specific key code
   * @param keyCode Key code
   * @returns Relative key name
   */
  getKeyName(keyCode: number) {
    return KEY_MAP[keyCode];
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
   * Check if a certain key is an action key
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

// This is necessary to not duplicate the wrappers code and not create another class instance in order to they stay synchronized with backend config.
const GeneralKeyboard = new UIGeneralKeyboard();

export default GeneralKeyboard;
