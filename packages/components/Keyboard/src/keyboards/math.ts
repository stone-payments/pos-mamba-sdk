import { KeyboardType, LayoutDirection, KeyboardTypesPredefinedOptions } from '../types';
import { themeDefault, themePrefix } from '../helpers/classNames';
import { keyCheck, keyBackspace } from '../mappings/keyFunction';

const divide = '{÷}';
const multiply = '{×}';
const minus = '{−}';
const plus = '{+}';
const equal = '{=}';

const keyboard: KeyboardTypesPredefinedOptions = {
  layoutName: 'math',
  keyboardType: KeyboardType.Math,
  layoutDirection: LayoutDirection.Vertical,
  theme: `${themeDefault} ${themePrefix}-numeric ${themePrefix}-math`,
  layout: {
    math: [
      `1 2 3`,
      '4 5 6',
      `7 8 9`,
      `${keyBackspace} 0 ${keyCheck}`,
      `${divide} ${multiply} ${minus} ${plus} ${equal}`,
    ],
  },
  labels: {
    [keyCheck]: ' ',
    [keyBackspace]: ' ',
  },
  outputs: {
    [keyCheck]: 'enter',
    [divide]: '÷',
    [multiply]: '×',
    [minus]: '−',
    [plus]: '+',
    [equal]: '=',
  },
  allowKeySyntheticEvent: [divide, multiply, minus, plus, equal],
};

export default keyboard;
