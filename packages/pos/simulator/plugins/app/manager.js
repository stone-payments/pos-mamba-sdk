import Signal from '../../libs/signal.js';
import App from '../../../api/app.js';
import extendDriver from '../../../drivers/extend.js';
import { log, warn } from '../../libs/utils.js';
import initEventCollector from './includes/eventCollector.js';

const AppManager = extendDriver({}, initEventCollector);

const Apps = {};
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
  if (!Apps[manifest.slug]) {
    const appMetaObj = {
      constructor: AppConstructor,
      manifest,
    };

    Apps[manifest.slug] = appMetaObj;

    AppManager.fire('appInstalled', appMetaObj);
  } else if (__DEV__) {
    warn(
      `Tried to install an already installed app with slug "${manifest.slug}"`,
    );
  }
};

AppManager.open = (appSlug, target) => {
  AppManager.fire('willOpen');

  target = target || document.getElementById('app-root');

  /** First time opening an app */
  const appMetaObj = Apps[appSlug];

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

  AppManager.fire('opened', currentApp);
  App.fire('opened');
};

AppManager.close = () => {
  if (__DEV__) log('Closing App');

  if (currentApp) {
    AppManager.fire('willClose', currentApp);

    App.fire('closed');

    if (currentApp.runtime.instance) {
      const { runtime } = currentApp;
      runtime.instance.destroy();
      delete currentApp.runtime;

      const collectedEventsKeys = Object.keys(runtime.collectedEvents);
      collectedEventsKeys.forEach(targetConstructor => {
        let node;

        if (targetConstructor === 'Window') node = window;
        if (targetConstructor === 'HTMLDocument') node = document;
        if (!node) return;

        Object.entries(runtime.collectedEvents[targetConstructor]).forEach(
          ([eventType, eventList]) => {
            eventList.forEach(fn => {
              node.removeEventListener(eventType, fn);
              if (__DEBUG_LVL__ >= 3) {
                log('Removing collected DOM event listener: ');
                console.log([node, eventType, fn]);
              }
            });
          },
        );
      });

      AppManager.fire('closed', currentApp);

      currentApp = null;
    } else if (__DEV__) {
      warn('App already closed');
    }
  }
};

export default AppManager;
