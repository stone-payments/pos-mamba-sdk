import DriverManager from '../driver/manager.js';
import Signal from '../../libs/signal.js';
import App from '../../../api/app.js';
import extendDriver from '../../../drivers/extend.js';
import { log, warn } from '../../libs/utils.js';
import initEventCollector from './includes/eventCollector.js';

const AppManager = extendDriver({}, initEventCollector);

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

  appMetaObj.runtime = {
    target,
    collectedEvents: {},
  };

  currentApp = appMetaObj;
  currentApp.runtime.instance = new appMetaObj.constructor({ target });

  AppManager.fire('opened');
  App.fire('opened');
};

AppManager.close = () => {
  AppManager.fire('willClose');

  if (__DEV__) log('Closing App');

  App.fire('closed');

  if (currentApp.runtime.instance) {
    const { runtime } = currentApp;
    runtime.instance.destroy();
    delete currentApp.runtime;

    const collectedEventsKeys = Object.keys(runtime.collectedEvents);
    collectedEventsKeys.forEach(targetName => {
      let node;

      if (targetName === 'window') node = window;
      if (targetName === 'document') node = document;

      if (node) {
        const eventTypes = Object.keys(runtime.collectedEvents[targetName]);
        eventTypes.forEach(eventType => {
          runtime.collectedEvents[targetName][eventType].forEach(fn => {
            node.removeEventListener(eventType, fn);
            if (__DEBUG_LVL__ >= 3) {
              log('Removing collected DOM event listener: ');
              console.log([node, eventType, fn]);
            }
          });
        });
      }
    });

    if (currentApp.drivers) {
      currentApp.drivers.forEach(driverModule => {
        DriverManager.resetDriverState(driverModule);
      });
    }

    currentApp = null;
  } else if (__DEV__) {
    warn('App already closed');
  }

  AppManager.fire('closed');
};

export default AppManager;
