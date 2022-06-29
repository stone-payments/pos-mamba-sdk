import { KeyboardType, LayoutDirection } from '../types';
import { themeDefault, layoutPrefix } from '../helpers/classNames';
import { keyCheck, keyDelete } from '../mappings/keyFunction';

export default {
  layoutName: 'numbers',
  keyboardType: KeyboardType.Numeric,
  layoutDirection: LayoutDirection.Horizontal,
  theme: `${themeDefault} ${layoutPrefix}-numeric`,
  layout: {
    numbers: ['1 2 3', '4 5 6', '7 8 9', `${keyDelete} 0 ${keyCheck}`],
  },
  onFunctionKeyPress: undefined,
};
