/**
 * This file is the boilerplate for the simulator core driver;
 * */
import Signal from '../../libs/signal.js';
import extendDriver from '../../../drivers/extend.js';

import initClock from './includes/clock.js';
import initData from './includes/data.js';

const RegistryManager = extendDriver(
  {
    _version: '2.5.0',
    _clock: { hours: null, min: null },
    _booted: false,
    _data: {},
  },
  initClock,
  initData,
);

Signal.register(RegistryManager, ['settingsChanged', 'clock']);

RegistryManager.setBoot = isBooted => {
  if (RegistryManager._booted) {
    return;
  }
  RegistryManager._booted = isBooted;
};

RegistryManager.getVersion = () => RegistryManager._version;

export default RegistryManager;
