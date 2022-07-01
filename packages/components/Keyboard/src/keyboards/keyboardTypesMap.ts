import { KeyboardType, KeyboardTypesPredefinedOptions } from '../types';
import { Default, Numeric, Phone, Math } from './index';

type NoCustomKeyboardType = Exclude<KeyboardType, KeyboardType.Custom>;

const keyboardTypesMap: Record<NoCustomKeyboardType, () => KeyboardTypesPredefinedOptions> = {
  [KeyboardType.Default]: () => Default,
  [KeyboardType.Numeric]: () => Numeric,
  [KeyboardType.Phone]: () => Phone,
  [KeyboardType.Math]: () => Math,
};

export default keyboardTypesMap;
