import getBaseDriver from './internal/base.js';
import modifier from './internal/modifier.js';

/** Used to extend a driver with the base driver */
export default function (driver, ...modifiers) {
  if (__DEV__ && typeof driver === 'undefined') {
    throw new Error('[@mamba/pos] Could not find the loaded driver.');
  }

  return modifier(driver, ...modifiers, getBaseDriver());
}
