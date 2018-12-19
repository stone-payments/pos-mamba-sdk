/**
 * This file is the boilerplate for the simulator core driver;
 * */
import Signal from '../../libs/signal.js';
import extendDriver from '../../../drivers/extend.js';

import initClock from './includes/clock.js';
import initData from './includes/data.js';

const RegistryManager = extendDriver(
  {
    _version: '2.5.3',
    _clock: { hours: null, min: null },
    _data: {},
  },
  initClock,
  initData,
);

Signal.register(RegistryManager, [
  'shallowChange', // fired at a shallow settings update/reset/redefinition
  'deepChange', // fired at a deep settings update
  'clock', // fired at every clock update
]);

RegistryManager.getVersion = () => RegistryManager._version;

let lastCachedStatedJson;
let savedState;

RegistryManager.getSavedState = () => {
  if (!localStorage) {
    return {};
  }

  const cachedStatedJson = localStorage.getItem('_mamba_web_');

  if (!cachedStatedJson) {
    return {};
  }

  if (lastCachedStatedJson === cachedStatedJson) {
    return savedState;
  }

  lastCachedStatedJson = cachedStatedJson;
  savedState = JSON.parse(cachedStatedJson);

  return savedState;
};

export default RegistryManager;
