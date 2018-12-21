/**
 * This file initializes every aspect of the simulator (logic and view).
 * */

import {
  AppManager,
  HardwareManager,
  DriverManager,
  System,
  Registry,
} from './plugins/index.js';

import { log, warn, error } from './libs/utils.js';

import './boot.js';

/** Mamba Web simulator global object */
window.MambaWeb = {
  System,
  Registry,
  HardwareManager,
  DriverManager,
  AppManager,
};

const { getView } = System;

export {
  /** Get a single instance of the virtual POS */
  getView,
  /** Simulator drivers */
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
