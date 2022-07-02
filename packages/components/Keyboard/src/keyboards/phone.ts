import { KeyboardType, LayoutDirection } from '../types';
import { themeDefault, themePrefix } from '../helpers/classNames';
import { keyBackspace, keyEnter } from '../mappings/keyFunction';

import type { KeyboardTypesPredefinedOptions } from '../types';

const keyboard: KeyboardTypesPredefinedOptions = {
  layoutName: 'phone',
  keyboardType: KeyboardType.Phone,
  layoutDirection: LayoutDirection.Horizontal,
  theme: `${themeDefault} ${themePrefix}-phone`,
  layout: {
    phone: ['1 2 3', '4 5 6', '7 8 9 ', `${keyBackspace} 0 ${keyEnter}`],
  },
  labels: {
    [keyEnter]: ' ',
  },
};

export default keyboard;
