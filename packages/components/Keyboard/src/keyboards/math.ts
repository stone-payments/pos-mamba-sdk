import { KeyboardType, LayoutDirection, KeyboardTypesPredefinedOptions } from '../types';
import { themeDefault, themePrefix } from '../helpers/classNames';
import { keyCheck, keyBackspace } from '../mappings/keyFunction';

const keyboard: KeyboardTypesPredefinedOptions = {
  layoutName: 'math',
  keyboardType: KeyboardType.Math,
  layoutDirection: LayoutDirection.Vertical,
  theme: `${themeDefault} ${themePrefix}-math`,
  layout: {
    math: [`1 2 3`, '4 5 6', `7 8 9`, `${keyBackspace} 0 ${keyCheck}`, `{÷} {×} {−} {+} {=}`],
  },
  labels: {
    [keyCheck]: ' ',
    [keyBackspace]: ' ',
  },
  outputs: {
    [keyCheck]: 'enter',
    '{÷}': '÷',
    '{×}': '×',
    '{−}': '−',
    '{+}': '+',
    '{=}': '=',
  },
  onFunctionKeyPress: undefined,
};

export default keyboard;