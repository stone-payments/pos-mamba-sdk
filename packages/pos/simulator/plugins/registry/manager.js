/**
 * This file is the boilerplate for the simulator core driver;
 * */
import EventTarget from '../../libs/EventTarget.js';
import extend from '../../../extend.js';

import initData from './includes/data.js';
import initPersistent from './includes/persistent.js';
import initScriptHook, { REGISTRY_INIT_HOOK_NAME } from './includes/initScriptHook.js';

const Registry = extend(
  { Addons: {} },
  { hooks: { initScriptHook } },
  initPersistent,
  initData,
  EventTarget(),
);

export { REGISTRY_INIT_HOOK_NAME };

export default Registry;
