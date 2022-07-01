import { KeyboardType, LayoutDirection, KeyboardTypesPredefinedOptions } from '../types';
import { themeDefault, themePrefix } from '../helpers/classNames';
import { keyCheck, keyBackspace } from '../mappings/keyFunction';

const division = '{÷}';
const multiply = '{×}';
const minus = '{−}';
const plus = '{+}';
const equal = '{=}';
const percentage = '{%}';
const clear = '{clear}';
const decimal = '{.}';

const outputsDefault = {
  [division]: '÷',
  [multiply]: '×',
  [minus]: '−',
  [plus]: '+',
  [equal]: '=',
  [percentage]: '%',
  [decimal]: ',',
};

const keyboard: KeyboardTypesPredefinedOptions = {
  layoutName: 'math',
  keyboardType: KeyboardType.Math,
  layoutDirection: LayoutDirection.Horizontal,
  theme: `${themeDefault} ${themePrefix}-math`,
  layout: {
    math: [
      `${clear} ${keyBackspace} ${percentage} ${division}`,
      `1 2 3 ${multiply}`,
      `4 5 6 ${plus}`,
      `7 8 9 ${minus}`,
      `${decimal} 0 ${equal} ${keyCheck}`,
    ],
  },
  labels: {
    ...outputsDefault,
    [keyCheck]: ' ',
    [keyBackspace]: ' ',
    [clear]: 'C',
  },
  outputs: {
    ...outputsDefault,
    [keyCheck]: 'enter',
    [clear]: 'AC',
  },
  allowKeySyntheticEvent: [division, multiply, minus, plus, equal, decimal, clear, percentage],
};

export default keyboard;
