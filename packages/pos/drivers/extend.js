import getBaseDriver from './base.js';

/** Used to extend a driver with the base driver */
export default function(driver, ...modifiers) {
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
