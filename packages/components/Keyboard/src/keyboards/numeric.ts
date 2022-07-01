import { KeyboardType, LayoutDirection, KeyboardTypesPredefinedOptions } from '../types';
import { themeDefault, themePrefix } from '../helpers/classNames';
import { keyCheck, keyBackspace } from '../mappings/keyFunction';

const keyboard: KeyboardTypesPredefinedOptions = {
  layoutName: 'numeric',
  keyboardType: KeyboardType.Numeric,
  layoutDirection: LayoutDirection.Horizontal,
  theme: `${themeDefault} ${themePrefix}-numeric`,
  layout: {
    numeric: [`1 2 3`, '4 5 6', `7 8 9`, `${keyBackspace} 0 ${keyCheck}`],
  },
  labels: {
    [keyCheck]: ' ',
    [keyBackspace]: ' ',
  },
  outputs: {
    [keyCheck]: 'enter',
  },
};

export default keyboard;
