import { KEYBOARD } from '@mamba/core';
import KEY_TABLE_MAP from '../mappings/keyTableMap';
import KEY_TABLE_LIST from '../mappings/keyTableMapList';

type AnyParsedKeyValue = number | string | undefined;
type ParsedEventInfo = [AnyParsedKeyValue, AnyParsedKeyValue | null];
interface KeyEventSupportedModifier {
  shiftKey: boolean;
}

const { KEY_MAP, KEY_CODE_LIST } = KEYBOARD;
/**
 *  General methods to map and handle keys, and change keyboard mode
 */
class UIGeneralKeyboard {
  /**
   * Define if backspace button should be enabled
   */
  static backspaceEnabled = true;

  /**
   * Define if keyboard is alphanumeric or numeric
   */
  static alphanumericEnabled = false;

  /**
   * Check Keyboard instance
   * @returns Returns if instance exist or not
   */
  static hasKeyboardInstance(): boolean {
    return Boolean(window.MambaKeyboardInstance && window.MambaKeyboardInstance.instance);
  }

  static checkInstanceIsValid(): boolean {
    if (!UIGeneralKeyboard.hasKeyboardInstance()) {
      throw new Error(
        'Cant call the method of null Keyboard instance. You should start a Keyboard instance to use its methods',
      );

      return false;
    }

    return true;
  }

  /**
   * Keyboard method wrapper to validate Keyboard instance if something happens to it (eg. destroyed)
   * @param method Keybaord method
   */
  static bindWrapper(method: (...args: any[]) => any | void): any | void {
    if (typeof method !== 'function') return;

    return (...args: any[]) => {
      if (UIGeneralKeyboard.checkInstanceIsValid()) {
        method.apply(window.MambaKeyboardInstance.instance, args);
      }
    };
  }

  /**
   * Internal control for virtual keyboard when Sets the kernel keyboard to enter numbers only.
   */
  static setKeyboardAsNumeric(): void {
    UIGeneralKeyboard.alphanumericEnabled = false;
  }

  /**
   * Internal control for virtual keyboard when Sets the kernek keyboard to type alphanumeric characters.
   */
  static setKeyboardAsAlphanumeric(): void {
    UIGeneralKeyboard.alphanumericEnabled = true;
  }

  /**
   * Find the key code of given list and key map
   *
   * @param list Key list to find
   * @param map Map object with { keyCode : value }
   * @param keyName Key name to find its code
   * @returns Found key code or `null`
   */
  static getMappedKeyCode(
    list: any[],
    map: { [key: number]: string | string[] },
    keyName: string,
  ): string | null {
    if (!Array.isArray(list)) return null;

    const found = list.find((code: string | number) => {
      const maped: string = map[code];
      if (Array.isArray(maped)) return maped.indexOf(keyName) !== -1;
      if (typeof maped === 'string') return maped.toLowerCase() === keyName.toLowerCase();

      return false;
    });

    return found || null;
  }

  /**
   * Find the key name of given list and map for an KeyboardEvent
   *
   * @param keyCode Key code to find its name
   * @param modifiers Keyboard event modifierds
   * @returns Found key name or `null`
   */
  static getEventMappedKeyName(
    keyCode: number,
    modifiers: KeyEventSupportedModifier,
  ): string | null {
    const found = KEY_TABLE_MAP[keyCode];
    if (!found) return null;

    if (Array.isArray(found)) {
      if (modifiers.shiftKey && found.length > 1) {
        return found[1];
      }

      return found[0];
    }

    return found || null;
  }

  /**
   * Get the key code relative to a specific key name compatible with POS
   * @param keyName Key name
   * @returns Relative key code
   */
  static getKeyCode(keyName: string): number | null {
    if (typeof keyName !== 'string') return null;
    const code = UIGeneralKeyboard.getMappedKeyCode(KEY_CODE_LIST, KEY_MAP, keyName);
    return code ? Number.parseInt(code, 10) : null;
  }

  /**
   * Get UTF key code relative to a specific key name compatible with POS
   * @param keyName Key name
   * @param inferCharCode IF should infer via UTF table code (String.charCodeAt)
   * @returns Relative key code
   */
  static getTableKeyCode(keyName: string, inferCharCode = false): any {
    if (typeof keyName !== 'string') return null;
    let code: string | number | null = UIGeneralKeyboard.getMappedKeyCode(
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
  static getKeyName(keyCode: number | undefined): string | undefined {
    if (typeof keyCode === 'undefined') return keyCode;
    const key = KEY_MAP[keyCode];
    if (key) {
      return String(KEY_MAP[keyCode]);
    }

    return undefined;
  }

  /**
   * Get the mamba normalized key code from user input event
   *
   * - Use e.key{string} on some events on simulator or POS
   * - Use e.keyIdentifier{string} to work on POS values
   * - Use e.code{number} to work with alphabet keyboard
   *
   * @param event User input event
   * @returns Relative key code
   */
  static parseEventKeyCode(event: KeyboardEvent): any {
    const keyCode =
      typeof event.keyCode === 'number' && event.keyCode !== 0
        ? event.keyCode
        : event.charCode || event.which || event.code;
    return keyCode;
  }

  /**
   * Get the mamba normalized key name from user input event
   * @param event User input event
   * @returns The key name relative to its number
   */
  static parseEventKeyName(event: KeyboardEvent) {
    const code = UIGeneralKeyboard.parseEventKeyCode(event);
    return UIGeneralKeyboard.getKeyName(code);
  }

  /**
   * Gets the normalized key code and name according to the POS key map through a keyboard input event.
   * @param event User input event
   * @returns A tuple containing the key code and key name respectively. Ex.: [13, "enter"]
   */
  static parseEventKeys(event: KeyboardEvent): ParsedEventInfo {
    const code = UIGeneralKeyboard.parseEventKeyCode(event);
    if (event.shiftKey) {
      return [code, UIGeneralKeyboard.getEventMappedKeyName(code, { shiftKey: event.shiftKey })];
    }
    return [code, UIGeneralKeyboard.getKeyName(code)];
  }

  /**
   * Check if a certain key is a numeric key
   * @param keyCode Key code
   * @returns
   */
  static isNumericKey(keyCode: number): boolean {
    return !Number.isNaN(parseFloat(KEY_MAP[keyCode]));
  }

  /**
   * Check if a certain key is key that have an functionality
   * @param keyCode Key code
   * @returns
   */
  static isFunctionKey(keyCode: number): boolean {
    return !UIGeneralKeyboard.isNumericKey(keyCode);
  }

  /**
   * Check if a certain key is an action key
   * @param keyCode Key code
   * @deprecated Use `isFunctionKey(keyCode)`
   * @returns
   */
  static isActionKey(keyCode: number): boolean {
    return UIGeneralKeyboard.isFunctionKey(keyCode);
  }

  /**
   * Return if the backspace button is enabled
   * @returns
   */
  static isBackspaceEnabled(): boolean {
    return UIGeneralKeyboard.backspaceEnabled;
  }

  /**
   * Switch OFF backspace key
   */
  static disableBackspace() {
    UIGeneralKeyboard.backspaceEnabled = false;
  }

  /**
   * Switch ON backspace key
   */
  static enableBackspace() {
    UIGeneralKeyboard.backspaceEnabled = true;
  }
}

export { UIGeneralKeyboard };

// This is necessary to not duplicate the wrappers code and not create another class instance in order to they stay synchronized with backend config on embeded POS application.
const GeneralKeyboard = UIGeneralKeyboard;

export default GeneralKeyboard;
