/**
 * This file is the boilerplate for the simulator core driver;
 * */
import { log } from '../../libs/utils.js';
import Signal from '../../libs/signal.js';
import extendDriver from '../../../drivers/extend.js';

const RegistryManager = extendDriver({
  _version: '2.5.0',
  _clock: { hours: null, min: null },
  _booted: false,
  _data: {},
});

Signal.register(RegistryManager, ['settingsChanged', 'clock']);

/** System */
RegistryManager.setBoot = isBooted => {
  if (RegistryManager._booted) {
    return;
  }
  RegistryManager._booted = isBooted;
};

RegistryManager.getVersion = () => RegistryManager._version;

/** Time */
setInterval(
  (function timer() {
    const curDate = new Date();
    const minutes = String(curDate.getMinutes()).padStart(2, '0');
    const hours = String(curDate.getHours()).padStart(2, '0');

    RegistryManager._clock = { hours, minutes };
    RegistryManager.clock(hours, minutes);

    return timer;
  })(),
  1000,
);

RegistryManager.getCurrentTime = () => RegistryManager._clock;

/** Data */
RegistryManager.get = keyPath => {
  if (keyPath === undefined) {
    return RegistryManager._data;
  }

  const keys = keyPath.replace(/\[(\d+)\]/g, '.$1').split('.');
  let value = RegistryManager._data[keys[0]];
  for (let i = 1; i < keys.length; i++) {
    value = value[keys[i]];
  }
  return value;
};

RegistryManager.set = (keyPath, value, fireSignal = true) => {
  if (keyPath === undefined) {
    return;
  }

  const keys = keyPath.replace(/\[(\d+)\]/g, '.$1').split('.');
  const lastKey = keys.pop();

  if (__DEBUG_LVL__ >= 2 && __BROWSER__) {
    log(`"${keyPath}" = ${JSON.stringify(value)}`);
  }

  // If not a nested keyPath
  if (keys[0] === undefined) {
    RegistryManager._data[lastKey] = value;
    return;
  }

  let object = RegistryManager._data[keys[0]];
  for (let i = 1; i < keys.length; i++) {
    object = object[keys[i]];
  }
  object[lastKey] = value;

  if (fireSignal) {
    RegistryManager.settingsChanged(RegistryManager._data);
  }
};

export default RegistryManager;
