/**
 * This file is the boilerplate for the simulator core driver;
 * */
import { log } from '../libs/utils.js';
import Signal from '../libs/signal.js';
import extendDriver from '../../drivers/extend.js';

const Core = extendDriver({
  _booted: false,
  _data: {},
});

Signal.register(Core, ['settingsChanged', 'print', 'toggleCard']);

Core.setBoot = isBooted => {
  if (Core._booted) return;
  Core._booted = isBooted;
};

Core.get = keyPath => {
  if (keyPath === undefined) {
    return Core._data;
  }

  const keys = keyPath.replace(/\[(\d+)\]/g, '.$1').split('.');
  let value = Core._data[keys[0]];
  for (let i = 1; i < keys.length; i++) {
    value = value[keys[i]];
  }
  return value;
};

Core.set = (keyPath, value, fireSignal = true) => {
  if (keyPath === undefined) {
    return;
  }

  const keys = keyPath.replace(/\[(\d+)\]/g, '.$1').split('.');
  const lastKey = keys.pop();

  if (__DEV__ && __BROWSER__) {
    log(`"${keyPath}" = ${JSON.stringify(value)}`);
  }

  // If not a nested keyPath
  if (keys[0] === undefined) {
    Core._data[lastKey] = value;
    return;
  }

  let object = Core._data[keys[0]];
  for (let i = 1; i < keys.length; i++) {
    object = object[keys[i]];
  }
  object[lastKey] = value;

  if (fireSignal) {
    Core.settingsChanged(Core._data);
  }
};

window.MambaWeb = window.MambaWeb || Core;

export default Core;
