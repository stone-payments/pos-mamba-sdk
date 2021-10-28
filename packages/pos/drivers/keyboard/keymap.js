/**
 * KeyCode <-> KeyName dictionary
 */

export const KEYUP = 38;

export const KEYDOWN = 40;

export const ENTER = 13;

export const KEYMAP = Object.freeze({
  [ENTER]: 'enter',
  8: 'back',
  27: 'close',
  17: 'help', // MP35 F1 of keyIdentifier: "U+1000021"
  135: 'F24', // MP35 F2. The 'F24' is the keyIdentifier from MP35 POS
  16: 'shortcuts', // MP35 F3 of keyIdentifier: "U+1000020"
  134: 'F23', // MP35 power button. The 'F23' is the keyIdentifier from MP35 POS
  [KEYUP]: 'keyup',
  [KEYDOWN]: 'keydown',
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
