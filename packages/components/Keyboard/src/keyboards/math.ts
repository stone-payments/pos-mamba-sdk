import { KeyboardType, LayoutDirection } from '../types';
import { themeDefault, layoutPrefix } from '../helpers/classNames';
import { keyCheck, keyDelete } from '../mappings/keyFunction';

export default {
  layoutName: 'numbers',
  keyboardType: KeyboardType.Math,
  layoutDirection: LayoutDirection.Vertical,
  theme: `${themeDefault} ${layoutPrefix}-math`,
  layout: {
    numbers: [`1 4 7 ${keyDelete}`, '2 5 8 0', `3 6 9 ${keyCheck}`, `÷ × − + =`],
  },
  onFunctionKeyPress: undefined,
};
