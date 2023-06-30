/**
 * This file initializes every aspect of the simulator (logic and view).
 * */

import { AppManager, HardwareManager, DriverManager, Registry, System } from './plugins/index.js';
import { log, warn, error } from './libs/utils.js';
import './boot.js';
import View from './view/manager.js';

export {
  /** Simulator plugins */
  View,
  System,
  Registry,
  HardwareManager,
  AppManager,
  DriverManager,
  /** Simulator Utilities */
  log,
  warn,
  error,
};

/** Mamba Web simulator global object */
window.MambaWeb = {
  System,
  Registry,
  HardwareManager,
  DriverManager,
  AppManager,
  View,
};
