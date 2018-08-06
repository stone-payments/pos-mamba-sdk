import Printer from './drivers/native/printer.js';
import App from './drivers/native/app.js';
import MbCookie from './drivers/native/cookie.js';
import Keyboard from './drivers/native/keyboard.js';
import MbMerchant from './drivers/native/merchant.js';
import Payment from './drivers/native/payment.js';
import System from './drivers/native/system.js';
import Cancellation from './drivers/native/cancellation.js';
import Http from './drivers/native/http.js';
import PaymentApp from './drivers/native/private/payment.js';

const NATIVE_DRIVERS = {
  Printer,
  App,
  MbCookie,
  Keyboard,
  MbMerchant,
  Payment,
  System,
  PaymentApp,
  $Http: Http,
  $Cancellation: Cancellation,
};

function createNativeDrivers() {
  if (__DEBUG__) console.groupCollapsed('Native simulated drivers');

  Object.keys(NATIVE_DRIVERS).forEach(driverRef => {
    if (__DEBUG__) console.log(driverRef);
    const driveSetup = NATIVE_DRIVERS[driverRef];
    const driverInstance = {};

    driveSetup(driverInstance);

    window[driverRef] = driverInstance;
  });

  if (__DEBUG__) console.groupEnd();
}

if (__BROWSER__) {
  createNativeDrivers();
}
