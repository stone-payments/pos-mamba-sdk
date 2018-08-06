import baseDriver from './base.js';

/** Used to extend a driver with the base driver */
export default function(driver, modifiers) {
  Object.assign(driver, baseDriver);
  if (modifiers && modifiers.length) {
    for (let i = 0; i < modifiers.length; i++) {
      const modifier = modifiers[i];
      if (typeof modifier === 'function') {
        modifiers[i](driver);
      } else {
        Object.assign(driver, modifier);
      }
    }
  }
  return driver;
}
