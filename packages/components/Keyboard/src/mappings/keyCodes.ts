/**
 * Represents keycodes of POS physical keyboard
 */

export const ENTER = 13;
export const KEYBACK = 8;
export const CLOSE = 27;
export const HELP = 17; // MP35 F1 of keyIdentifier: "U+1000021"
export const SHORTCUTS = 16; // MP35 F3 of keyIdentifier: "U+1000020"
export const F23 = 134; // MP35 power button. The 'F23' is the keyIdentifier from MP35 POS
export const F24 = 135; // MP35 F2. The 'F24' is the keyIdentifier from MP35 POS
export const KEYUP = 38;
export const KEYDOWN = 40;
export const KEY_0 = 48;
export const KEY_1 = 49;
export const KEY_2 = 50;
export const KEY_3 = 51;
export const KEY_4 = 52;
export const KEY_5 = 53;
export const KEY_6 = 54;
export const KEY_7 = 55;
export const KEY_8 = 56;
export const KEY_9 = 57;

export default Object.freeze({
  ENTER: 13,

  /**
   * @deprecated Use `BACKSPACE`
   */
  KEYBACK: 8,
  BACKSPACE: 8,

  CLOSE: 27,
  HELP: 17, // MP35 F1 of keyIdentifier: "U+1000021"
  SHORTCUTS: 16, // MP35 F3 of keyIdentifier: "U+1000020"
  F23: 134, // MP35 power button. The 'F23' is the keyIdentifier from MP35 POS
  F24: 135, // MP35 F2. The 'F24' is the keyIdentifier from MP35 POS

  /**
   * @deprecated Use `ARROW_UP`
   */
  KEYUP: 38,
  ARROW_UP: 38,

  /**
   * @deprecated Use `ARROW_DOWN`
   */
  KEYDOWN: 40,
  ARROW_DOWN: 40,

  KEY_0: 48,
  KEY_1: 49,
  KEY_2: 50,
  KEY_3: 51,
  KEY_4: 52,
  KEY_5: 53,
  KEY_6: 54,
  KEY_7: 55,
  KEY_8: 56,
  KEY_9: 57,
});
