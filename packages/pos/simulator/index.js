import './libs/boot.js';
import { State, attachDrivers } from './libs/main.js';

export { State, attachDrivers };
export { log, warn, error } from './libs/utils.js';

if (__DEV__) {
  window.MambaSimulator = State;
}
