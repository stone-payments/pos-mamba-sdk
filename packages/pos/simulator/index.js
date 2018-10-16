/**
 * This file initializes every aspect of the simulator (logic and view).
 * */

/**
 * This import order is **extremely** important since the POS.html
 * needs the simulator initialized.
 */
import Simulator from './core.js';
import './plugins/load.js';

Simulator.Registry.setBoot(true);

/** Mamba Web simulator global object */
export default Simulator;

/** Deprecated named exports, prefer to use Simulator properties directly */
const Core = Simulator;
const { attachDrivers } = Simulator.DriverManager;
const { getVirtualPOS } = Simulator;
export { Core, attachDrivers, getVirtualPOS };
