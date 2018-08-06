import Printer from './printer/browser.js';
import App from './app/browser.js';
import MbCookie from './cookie/browser.js';
import Http from './http/browser.js';
import Keyboard from './keyboard/browser.js';
import MbMerchant from './merchant/browser.js';
import Payment from './payment/browser.js';
import System from './system/browser.js';
import PaymentApp from './private/payment/browser.js';

const DRIVERS = {
  Printer,
  App,
  MbCookie,
  $Http: Http,
  Keyboard,
  MbMerchant,
  Payment,
  System,
  PaymentApp,
};

const baseDriver = {};

export default function initDrivers() {
  if (__DEBUG__) {
    console.groupCollapsed('Native simulated drivers:');
  }

  Object.keys(DRIVERS).forEach(driverName => {
    if (__DEBUG__) {
      console.log(driverName);
    }
    const driveSetup = DRIVERS[driverName];
    const driverInstance = Object.create(baseDriver);
    driveSetup(driverInstance);

    window[driverName] = driverInstance;
  });

  if (__DEBUG__) {
    console.groupEnd();
  }
}
