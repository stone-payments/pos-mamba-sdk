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

export const KEY_NAMES = {
  CLOSE: 'close',
  BACK: 'back',
  ENTER: 'enter',
  HELP: 'help',
  SHORTCUTS: 'shortcuts',
  KEYUP: 'keyup',
  KEYDOWN: 'keydown',
  F24: 'F24',
  F23: 'F23',
  KEY_0: '0',
  KEY_1: '1',
  KEY_2: '2',
  KEY_3: '3',
  KEY_4: '4',
  KEY_5: '5',
  KEY_6: '6',
  KEY_7: '7',
  KEY_8: '8',
  KEY_9: '9',
};

export const KEY_CODES = {
  ENTER,
  KEYBACK,
  CLOSE,
  HELP,
  SHORTCUTS,
  F23,
  F24,
  KEYUP,
  KEYDOWN,
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
};

export const KEYMAP = Object.freeze({
  [ENTER]: KEY_NAMES.ENTER,
  [KEYBACK]: KEY_NAMES.BACK,
  [CLOSE]: KEY_NAMES.CLOSE,
  [HELP]: KEY_NAMES.HELP,
  [SHORTCUTS]: KEY_NAMES.SHORTCUTS,
  [F23]: KEY_NAMES.F23,
  [F24]: KEY_NAMES.F24,
  [KEYUP]: KEY_NAMES.KEYUP,
  [KEYDOWN]: KEY_NAMES.KEYDOWN,
  [KEY_0]: KEY_NAMES.KEY_0,
  [KEY_1]: KEY_NAMES.KEY_1,
  [KEY_2]: KEY_NAMES.KEY_2,
  [KEY_3]: KEY_NAMES.KEY_3,
  [KEY_4]: KEY_NAMES.KEY_4,
  [KEY_5]: KEY_NAMES.KEY_5,
  [KEY_6]: KEY_NAMES.KEY_6,
  [KEY_7]: KEY_NAMES.KEY_7,
  [KEY_8]: KEY_NAMES.KEY_8,
  [KEY_9]: KEY_NAMES.KEY_9,
});
