import extendDriver from '../drivers/extend.js';
import * as simulatorDriver from './drivers/main.js';

export default extendDriver({}, [simulatorDriver.setup]);
