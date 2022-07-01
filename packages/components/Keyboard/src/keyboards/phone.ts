import { KeyboardType, LayoutDirection } from '../types';
import { themeDefault } from '../helpers/classNames';
import {
  $default,
  keyDefault,
  $alt,
  keyAlt,
  keyAltback,
  $shift,
  keyShift,
  $symbols,
  keySymbols,
  keyEnter,
  keyBackspace,
  keySpace,
} from '../mappings/keyFunction';

import type Keyboard from '../components/Keyboard';
import type { KeyboardHandlerEvent, KeyboardTypesPredefinedOptions } from '../types';

const keyboard: KeyboardTypesPredefinedOptions = {
  layoutName: 'default',
  keyboardType: KeyboardType.Phone,
  layoutDirection: LayoutDirection.Horizontal,
  theme: themeDefault,
  layout: {
    default: [
      'q w e r t y u i o p',
      'a s d f g h j k l',
      `${keyShift} z x c v b n m ${keyBackspace}`,
      `${keyAlt} ${keySpace} ${keyEnter}`,
    ],
    shift: [
      'Q W E R T Y U I O P',
      'A S D F G H J K L',
      `${keyShift} Z X C V B N M ${keyBackspace}`,
      `${keyAlt} ${keySpace} ${keyEnter}`,
    ],
    alt: [
      '1 2 3 4 5 6 7 8 9 0',
      '- / : ; ( ) $ & @ "',
      `${keySymbols} . , ? ! ' ${keyBackspace}`,
      `${keyDefault} ${keySpace} ${keyEnter}`,
    ],
    symbols: [
      '[ ] { } # % ^ * + =',
      '_ \\ / | ~ < > • `',
      `${keyAltback} . , ? ! ' ${keyBackspace}`,
      `${keyDefault} ${keySpace} ${keyEnter}`,
    ],
  },
  internalOnFunctionKeyPress: (button: string, instance: Keyboard, e?: KeyboardHandlerEvent) => {
    const currentLayout = instance.options.layoutName;
    let layoutName;

    switch (button) {
      case keyShift:
      case keyDefault:
        layoutName = currentLayout === $default ? $shift : $default;
        break;

      case keySymbols:
        layoutName = currentLayout === $symbols ? $default : $symbols;
        break;

      case keyAlt:
      case keyAltback:
        layoutName = currentLayout === $alt ? $default : $alt;
        break;

      default:
        break;
    }

    if (layoutName) {
      instance.setOptions({
        layoutName,
      });
    }
  },
  labels: {
    [keyEnter]: ' ',
  },
};

export default keyboard;
