/**
 * This file attaches all default simulated drivers
 * */
import Core from '../../core.js';
import DriverManager from './manager.js';
import * as Printer from '../../../drivers/printer/simulation.js';
import * as App from '../../../drivers/app/simulation.js';
import * as Storage from '../../../drivers/storage/simulation.js';
import * as Keyboard from '../../../drivers/keyboard/simulation.js';
import * as Merchant from '../../../drivers/merchant/simulation.js';
import * as Payment from '../../../drivers/payment/simulation.js';
import * as System from '../../../drivers/system/simulation.js';
import * as Cancellation from '../../../drivers/cancellation/simulation.js';
import * as Http from '../../../drivers/http/simulation.js';
import * as Card from '../../../drivers/card/simulation.js';

DriverManager.attachDrivers([
  Printer,
  App,
  Storage,
  Keyboard,
  Merchant,
  Payment,
  System,
  Http,
  Cancellation,
  Card,
]);

Core.DriverManager = DriverManager;
