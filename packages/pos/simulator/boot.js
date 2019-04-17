import { DriverManager } from './plugins/index.js';

import * as $Printer from './drivers/printer.js';
import * as $App from './drivers/app.js';
import * as $Storage from './drivers/storage.js';
import * as $Keyboard from './drivers/keyboard.js';
import * as $Merchant from './drivers/merchant.js';
import * as $Payment from './drivers/payment.js';
import * as $System from './drivers/system.js';
import * as $Cancellation from './drivers/cancellation.js';
import * as $Http from './drivers/http.js';
import * as $Card from './drivers/card.js';

DriverManager.attachDrivers([
  $Printer,
  $App,
  $Storage,
  $Keyboard,
  $Merchant,
  $Payment,
  $System,
  $Cancellation,
  $Http,
  $Card,
]);
