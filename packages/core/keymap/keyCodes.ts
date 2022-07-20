/**
 * Represents keycodes of POS physical keyboard
 */

export const BACKSPACE = 8;
/** Alias `BACKSPACE` */
export const KEYBACK = BACKSPACE;
export const ENTER = 13;
export const SHORTCUTS = 16; // MP35 F3 of keyIdentifier: "U+1000020"
export const HELP = 17; // MP35 F1 of keyIdentifier: "U+1000021"
export const CLOSE = 27;
export const SPACE = 32;
export const ARROW_UP = 38;
export const ARROW_DOWN = 40;

/** Numbers */
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

export const F23 = 134; // MP35 power button. The 'F23' is the keyIdentifier from MP35 POS
export const F24 = 135; // MP35 F2. The 'F24' is the keyIdentifier from MP35 POS

// Deprecated keys

/**
 * @deprecated Use `ARROW_UP`
 */
export const KEYUP = ARROW_UP;

/**
 * @deprecated Use `ARROW_DOWN`
 */
export const KEYDOWN = ARROW_DOWN;

export default Object.freeze({
  ENTER,

  /** Alias `BACKSPACE` */
  KEYBACK,
  BACKSPACE,

  CLOSE, // Escape key
  HELP, // MP35 F1 of keyIdentifier: "U+1000021". `Control` key alias
  SHORTCUTS, // MP35 F3 of keyIdentifier: "U+1000020". `Shift` key alias
  F23, // MP35 power button. The 'F23' is the keyIdentifier from MP35 POS
  F24, // MP35 F2. The 'F24' is the keyIdentifier from MP35 POS
  SPACE,

  /**
   * @deprecated Use `ARROW_UP`
   */
  KEYUP,
  ARROW_UP,

  /**
   * @deprecated Use `ARROW_DOWN`
   */
  KEYDOWN,
  ARROW_DOWN,

  /** Numbers */
  KEY_0,
  KEY_1,
  KEY_2,
  KEY_3,
  KEY_4,
  KEY_5,
  KEY_6,
  KEY_7,
  KEY_8,
  KEY_9,
});
