/**
 * This file is the boilerplate for the simulator core driver;
 * */
import EventTarget from '../../libs/EventTarget.js';
import extend from '../../../extend.js';

import initData from './includes/data.js';

const Registry = extend({}, initData, EventTarget());

export default Registry;
