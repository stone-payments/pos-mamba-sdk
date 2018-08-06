import extendDriver from '../drivers/extend.js';
import simulatorDriverSetup from './drivers/simulator.js';

export default extendDriver({}, [simulatorDriverSetup]);
