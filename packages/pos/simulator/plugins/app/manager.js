import DriverManager from '../driver/manager.js';
import Signal from '../../libs/signal.js';
import App from '../../../api/app.js';
import extendDriver from '../../../drivers/extend.js';
import { log, warn } from '../../libs/utils.js';

const AppManager = extendDriver({});

const Apps = new Map();
let currentApp = null;

Signal.register(AppManager, [
  'appInstalled',
  'willOpen',
  'opened',
  'willClose',
  'closed',
]);

AppManager.getInstalledApps = () => Apps;
AppManager.getCurrentApp = () => currentApp;

AppManager.installApp = (AppConstructor, manifest) => {
  if (!Apps.has(manifest.slug)) {
    const appMetaObj = {
      constructor: AppConstructor,
      manifest,
    };

    const looseDrivers = DriverManager.getLooseDrivers();
    if (looseDrivers) {
      appMetaObj.drivers = looseDrivers;
      DriverManager.clearLooseDrivers();
    }

    Apps.set(manifest.slug, appMetaObj);

    AppManager.fire('appInstalled', appMetaObj);
  }
};

AppManager.open = (appSlug, target) => {
  AppManager.fire('willOpen');

  target = target || document.getElementById('app-root');

  /** First time opening an app */
  const appMetaObj = Apps.get(appSlug);

  if (__DEV__) log(`Opening App: ${appMetaObj.manifest.appName}`);

  if (!target) {
    if (__DEV__) {
      console.warn('App target root element not found.');
    }
    return;
  }

  appMetaObj.instance = new appMetaObj.constructor({ target });
  appMetaObj.target = target;

  currentApp = appMetaObj;

  AppManager.fire('opened');
  App.fire('opened');
};

AppManager.close = () => {
  AppManager.fire('willClose');

  if (__DEV__) log('Closing App');

  App.fire('closed');

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
