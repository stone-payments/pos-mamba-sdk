import { KeyboardType, LayoutDirection, KeyboardTypesPredefinedOptions } from '../types';
import { themePrefix } from '../helpers/classNames';
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
  [division]: '/',
  [multiply]: '*',
  [minus]: '-',
  [plus]: '+',
  [equal]: '=',
  [percentage]: '%',
  [decimal]: '.',
  [keyBackspace]: '<',
};

const keyboard: KeyboardTypesPredefinedOptions = {
  layoutName: 'math',
  keyboardType: KeyboardType.Math,
  layoutDirection: LayoutDirection.Fixed,
  theme: `${themePrefix}-math`,
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
    [keyCheck]: 'check',
    [clear]: 'AC',
  },
  allowKeySyntheticEvent: [division, multiply, minus, plus, equal, decimal, clear, percentage],
};

export default keyboard;
