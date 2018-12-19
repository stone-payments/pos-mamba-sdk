import getBaseDriver from './base.js';

/** Used to extend a driver with the base driver */
export default function(driver, ...modifiers) {
  if (__DEV__ && typeof driver === 'undefined') {
    throw new Error('[@mamba/pos] Could not find the loaded driver.');
  }

  Object.assign(driver, getBaseDriver());

  for (let i = modifiers.length; i--; ) {
    const modifier = modifiers[i];
    if (typeof modifier === 'function') {
      modifiers[i](driver);
    } else {
      Object.assign(driver, modifier);
    }
  }

  return driver;
}
