/**
 * This file is the boilerplate for the simulator core driver;
 * */
import EventTarget from '../../libs/EventTarget.js';
import extend from '../../../extend.js';

import initData from './includes/data.js';
import initPersistent from './includes/persistent.js';

const Registry = extend({}, initPersistent, initData, EventTarget());

export default Registry;
