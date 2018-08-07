import { Simulator } from '../main.js';
import Signal from '../signal.js';

import * as Printer from './native/printer.js';
import * as App from './native/app.js';
import * as MbCookie from './native/cookie.js';
import * as Keyboard from './native/keyboard.js';
import * as MbMerchant from './native/merchant.js';
import * as Payment from './native/payment.js';
import * as System from './native/system.js';

import * as $Cancellation from './native/cancellation.js';
import * as $Http from './native/http.js';

import * as PaymentApp from './native/apps/payment.js';

const NATIVE_DRIVERS = {
  Printer,
  App,
  MbCookie,
  Keyboard,
  MbMerchant,
  Payment,
  System,
  $Http,
  $Cancellation,
  PaymentApp,
};

export default function createNativeDrivers() {
  if (__DEBUG__) console.groupCollapsed('Native simulated drivers');

  Object.keys(NATIVE_DRIVERS).forEach(driverRef => {
    if (__DEBUG__) console.groupCollapsed(driverRef);

    const driverModule = NATIVE_DRIVERS[driverRef];
    const driver = {};

    /** Overwrite the driverRef with the defined namespace */
    if (driverModule.NAMESPACE) {
      driverRef = driverModule.NAMESPACE;
    }

    /** Set the simulator default settings for the driver */
    if (driverModule.SETTINGS) {
      if (__DEBUG__) console.log('Default settings:', driverModule.SETTINGS);
      Simulator.set(driverRef, driverModule.SETTINGS);
    }

    /** Register the driver signals */
    if (driverModule.SIGNALS) {
      if (__DEBUG__) console.log('Signals:', driverModule.SIGNALS);
      Signal.register(driver, driverModule.SIGNALS);
    }

    /** Setup the driver methods */
    driverModule.setup(driver);

    /** Export it to the window */
    global[driverRef] = driver;

    if (__DEBUG__) console.groupEnd();
  });

  if (__DEBUG__) console.groupEnd();
}
