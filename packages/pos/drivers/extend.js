import baseDriver from './base.js';

/** Used to extend a driver with the base driver */
export default function(driver, ...modifiers) {
  driver = { ...driver, ...baseDriver };

  for (let i = modifiers.length; i--; ) {
    const modifier = modifiers[i];
    if (typeof modifier === 'function') {
      modifiers[i](driver);
    } else {
      Object.assign(driver, modifier);
    }
  }

  delete driver.deleteLater;

  return driver;
}
