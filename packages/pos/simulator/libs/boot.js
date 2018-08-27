import { attachDrivers } from './main.js';
import { log } from './utils.js';

import * as Printer from '../../drivers/printer/simulation.js';
import * as App from '../../drivers/app/simulation.js';
import * as MbCookie from '../../drivers/cookie/simulation.js';
import * as Keyboard from '../../drivers/keyboard/simulation.js';
import * as MbMerchant from '../../drivers/merchant/simulation.js';
import * as Payment from '../../drivers/payment/simulation.js';
import * as System from '../../drivers/system/simulation.js';

import * as $Cancellation from '../../drivers/cancellation/simulation.js';
import * as $Http from '../../drivers/http/simulation.js';

if (__DEV__ && __BROWSER__) log('Loading mamba simulated environment');

attachDrivers({
  Printer,
  App,
  MbCookie,
  Keyboard,
  MbMerchant,
  Payment,
  System,
  $Http,
  $Cancellation,
});
