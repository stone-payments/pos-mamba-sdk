/**
 * This file initializes every aspect of the simulator (logic and view).
 * */

/**
 * This import order is **extremely** important since the POS.html
 * needs the simulator initialized.
 */
import Simulator from './core.js';
import {
  AppManager,
  HardwareManager,
  DriverManager,
  System,
  Registry,
} from './plugins/index.js';
import { log, warn, error } from './libs/utils.js';
import { onBoot, onViewLoad } from './hooks.js';
import './boot.js';

Simulator.AppManager = AppManager;
Simulator.HardwareManager = HardwareManager;
Simulator.Registry = Registry;
Simulator.DriverManager = DriverManager;

window.MambaWeb = Simulator;

const { loadView } = System;

/** Mamba Web simulator global object */
export default Simulator;

export {
  onViewLoad,
  onBoot,
  /** Get a single instance of the virtual POS */
  loadView,
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
