/**
 * Represents keycodes of POS physical keyboard
 */

export const BACK = 8;
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

export const MENU_OR_ESCAPE = 134; // MP35 power button. The 'F23' is the keyIdentifier from MP35 POS (Menu or Escape?)
export const CAMERA = 135; // MP35 F2. The 'F24' is the keyIdentifier from MP35 POS (Camera?)

/** @deprecated Use `MENU_OR_ESCAPE` */
export const F23 = MENU_OR_ESCAPE; // MP35 power button. The 'F23' is the keyIdentifier from MP35 POS (Menu or Escape?)

/** @deprecated Use `CAMERA` */
export const F24 = CAMERA; // MP35 F2. The 'F24' is the keyIdentifier from MP35 POS (Camera?)

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
  BACK,
  CLOSE, // Escape key
  HELP, // MP35 F1 of keyIdentifier: "U+1000021". `Control` key alias
  SHORTCUTS, // MP35 F3 of keyIdentifier: "U+1000020". `Shift` key alias
  F23, // MP35 power button. The 'F23' is the keyIdentifier from MP35 POS
  F24, // MP35 F2. The 'F24' is the keyIdentifier from MP35 POS
  SPACE,

  ARROW_UP,
  ARROW_DOWN,

  /**
   * @deprecated Use `ARROW_UP`
   */
  KEYUP,

  /**
   * @deprecated Use `ARROW_DOWN`
   */
  KEYDOWN,

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
