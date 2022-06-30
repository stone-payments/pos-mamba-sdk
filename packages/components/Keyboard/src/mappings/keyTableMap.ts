import KEY_MAP from './keyMap';

/**
 * Represents general key code table with shift modifier
 */

// Values can be `string` or `tuple[2]`
// The actual meaning of the value depends on the users' keyboard layout
// Which cannot be detected. Assuming that it is a US keyboard layout
// Any other key non-listed here must avoid input change for POS environment
export default Object.freeze({
  ...KEY_MAP,
  48: ['0', ')'],
  49: ['1', '!'],
  50: ['2', '@'],
  51: ['3', '#'],
  52: ['4', '$'],
  53: ['5', '%'],
  54: ['6', '^'],
  55: ['7', '&'],
  56: ['8', '*'],
  57: ['9', '('],
  65: ['a', 'A'],
  66: ['b', 'B'],
  67: ['c', 'C'],
  68: ['d', 'D'],
  69: ['e', 'E'],
  70: ['f', 'F'],
  71: ['g', 'G'],
  72: ['h', 'H'],
  73: ['i', 'I'],
  74: ['j', 'J'],
  75: ['k', 'K'],
  76: ['l', 'L'],
  77: ['m', 'M'],
  78: ['n', 'N'],
  79: ['o', 'O'],
  80: ['p', 'P'],
  81: ['q', 'Q'],
  82: ['r', 'R'],
  83: ['s', 'S'],
  84: ['t', 'T'],
  85: ['u', 'U'],
  86: ['v', 'V'],
  87: ['w', 'W'],
  88: ['x', 'X'],
  89: ['y', 'Y'],
  90: ['z', 'Z'],
  186: [';', ':'],
  187: ['=', '+'],
  188: [',', '<'],
  189: ['-', '_'],
  190: ['.', '>'],
  191: ['/', '?'],
  192: ['`', '~'],
  219: ['[', '{'],
  220: ['\\', '|'],
  221: [']', '}'],
  222: [`'`, `"`],
  // Numpad math key codes
  106: '×',
  109: '−',
  107: '+',
  110: '.',
  111: '÷',
});
