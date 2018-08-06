import extendDriver from '../drivers/extend.js';
import simulatorDriverSetup from './drivers/main.js';

export default extendDriver({}, [simulatorDriverSetup]);
