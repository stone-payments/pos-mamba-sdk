/**
 * This file initializes every aspect of the simulator (logic and view).
 * */

/**
 * This import order is **extremely** important since the POS.html
 * needs the simulator initialized.
 */
import Simulator from './core.js';
import './plugins/load.js';
import { log, warn, error } from './libs/utils.js';

/** Mamba Web simulator global object */
export default Simulator;

const {
  getVirtualPOS,
  Registry,
  HardwareManager,
  AppManager,
  DriverManager,
} = Simulator;

export {
  /** Get a single instance of the virtual POS */
  getVirtualPOS,
  /** Simulator drivers */
  Registry,
  HardwareManager,
  AppManager,
  DriverManager,
  /** Simulator Utilities */
  log,
  warn,
  error,
};
