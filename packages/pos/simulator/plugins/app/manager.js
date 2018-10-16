import DriverManager from '../driver/manager.js';
import Signal from '../../libs/signal.js';
import App from '../../../api/app.js';
import extendDriver from '../../../drivers/extend.js';
import { log, warn } from '../../libs/utils.js';

const AppManager = extendDriver({});

const Apps = new Map();
let currentApp = null;

Signal.register(AppManager, ['opened', 'closed']);

AppManager.getLoaded = () => Apps;
AppManager.getCurrent = () => currentApp;

AppManager.register = (AppConstructor, manifest) => {
  if (!Apps.has(AppConstructor)) {
    const appMetaObj = {
      constructor: AppConstructor,
      manifest,
    };

    const looseDrivers = DriverManager.getLooseDrivers();
    if (looseDrivers) {
      appMetaObj.drivers = looseDrivers;
      DriverManager.clearLooseDrivers();
    }

    Apps.set(AppConstructor, appMetaObj);
  }
};

AppManager.open = (AppConstructor, target) => {
  AppConstructor = AppConstructor || currentApp.constructor;
  target = target || currentApp.target;

  /** First time opening an app */
  const appMetaObj = Apps.get(AppConstructor);

  if (__DEV__) log(`Opening App: ${appMetaObj.manifest.appName}`);

  appMetaObj.instance = new AppConstructor({ target });
  appMetaObj.target = target;

  currentApp = appMetaObj;

  App.opened();
  AppManager.fire('opened');
};

AppManager.close = () => {
  if (__DEV__) log('Closing App');

  App.closed();

  if (currentApp.instance) {
    currentApp.instance.destroy();
    currentApp.instance = null;

    if (currentApp.drivers) {
      currentApp.drivers.forEach(driverModule => {
        DriverManager.resetDriverState(driverModule);
      });
    }
  } else if (__DEV__) {
    warn('App already closed');
  }

  AppManager.fire('closed');
};

AppManager.restart = () => {
  AppManager.once('closed', () => AppManager.open());
  AppManager.close();
};

export default AppManager;
