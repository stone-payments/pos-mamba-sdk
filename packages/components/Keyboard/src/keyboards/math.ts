import { KeyboardType, LayoutDirection } from '../types';
import { themeDefault, themePrefix } from '../helpers/classNames';
import { keyCheck, keyBackspace } from '../mappings/keyFunction';

export default {
  layoutName: 'math',
  keyboardType: KeyboardType.Math,
  layoutDirection: LayoutDirection.Vertical,
  theme: `${themeDefault} ${themePrefix}-math`,
  layout: {
    // math: [`1 4 7 ${keyBackspace}`, '2 5 8 0', `3 6 9 ${keyCheck}`, `÷ × − + =`],
    math: [`1 2 3`, '4 5 6', `7 8 9`, `${keyBackspace} 0 ${keyCheck}`, `÷ × − + =`],
  },
  labels: {
    [keyCheck]: ' ',
    [keyBackspace]: ' ',
  },
  onFunctionKeyPress: undefined,
};
