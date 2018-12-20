/**
 * This file is the boilerplate for the simulator core driver;
 * */
import EventTarget from '../../libs/EventTarget.js';
import extend from '../../../extend.js';

import initData from './includes/data.js';

const RegistryManager = extend(
  {
    _data: {},
  },
  initData,
  EventTarget(),
);

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
