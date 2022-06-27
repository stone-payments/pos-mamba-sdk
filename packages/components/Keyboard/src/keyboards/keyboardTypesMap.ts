import { KeyboardType, KeyboardTypesPredefinedOptions } from '../types';
import { Default, Email, Numeric, Phone } from './index';

type NoCustomKeyboardType = Exclude<KeyboardType, KeyboardType.Custom>;

const keyboardTypesMap: Record<NoCustomKeyboardType, () => KeyboardTypesPredefinedOptions> = {
  [KeyboardType.Default]: () => Default,
  [KeyboardType.Numeric]: () => Numeric,
  [KeyboardType.Email]: () => Email,
  [KeyboardType.Phone]: () => Phone,
};

export default keyboardTypesMap;
