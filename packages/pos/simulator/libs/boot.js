import { attachDrivers } from './main.js';
import { log } from './utils.js';

import * as Printer from '../drivers/native/printer.js';
import * as App from '../drivers/native/app.js';
import * as MbCookie from '../drivers/native/cookie.js';
import * as Keyboard from '../drivers/native/keyboard.js';
import * as MbMerchant from '../drivers/native/merchant.js';
import * as Payment from '../drivers/native/payment.js';
import * as System from '../drivers/native/system.js';

import * as $Cancellation from '../drivers/native/cancellation.js';
import * as $Http from '../drivers/native/http.js';

if (__DEBUG__) log('Loading mamba environment');

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
