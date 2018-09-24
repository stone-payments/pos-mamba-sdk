import './libs/boot.js';
import './libs/events.js';
import { Core, virtualPOS, createPOSInstance } from './libs/main.js';
import POS from './view/POS.html';

/** Initialize a single POS instance and return it */
export const getVirtualPOS = store => {
  if (!virtualPOS) {
    createPOSInstance(new POS({ target: document.body, store }));
  }
  return virtualPOS;
};

export { Core };
export { log, warn, error, attachDrivers } from './libs/utils.js';
