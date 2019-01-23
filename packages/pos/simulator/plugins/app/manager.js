import EventTarget from '../../libs/EventTarget.js';
import { log, warn } from '../../libs/utils.js';
import extend from '../../../extend.js';
import { DriverManager } from '../index.js';

import initCollector from './includes/collector.js';
import initSuspension from './includes/suspension.js';

const AppManager = extend({}, initCollector, initSuspension, EventTarget());

const Apps = {};

const openedApps = [];

AppManager.getApp = slug => Apps[slug];
AppManager.getInstalledApps = () => Apps;
AppManager.getOpenedApps = () => openedApps;
AppManager.getCurrentApp = () => openedApps[openedApps.length - 1];

const loadApp = appMeta => {
  AppManager.fire('loading');
  return appMeta.loader().then(({ default: App }) => {
    AppManager.fire('loaded');
    Apps[appMeta.manifest.slug].RootComponent = App;
  });
};

AppManager.installApp = ({ manifest, RootComponent, loader }) => {
  if (!Apps[manifest.slug]) {
    const appMeta = { manifest, RootComponent, loader };

    Apps[manifest.slug] = appMeta;

    AppManager.fire('appInstalled', appMeta);
  } else if (__DEV__) {
    warn(
      `Tried to install an already installed app with slug "${manifest.slug}"`,
    );
  }

  return Apps[manifest.slug];
};

AppManager.open = async (appSlug, options = {}) => {
  /** First time opening an app */
  const appMeta = Apps[appSlug];

  if (!appMeta.RootComponent) {
    await loadApp(appMeta);
  }

  AppManager.fire('opening', appMeta, options);

  if (__DEV__) log(`Opening App: ${appMeta.manifest.appName}`);

  const appsEl = document.getElementById('apps-container');
  const target = document.createElement('DIV');
  appsEl.appendChild(target);

  if (!target) {
    if (__DEV__) {
      console.warn('App target root element not found.');
    }
    return;
  }

  appMeta.runtime = {
    target,
    collectedEvents: {},
  };

  const currentApp = AppManager.getCurrentApp();

  if (currentApp) {
    await AppManager.suspend(currentApp);
  }

  /** Insert the most current app at the first index */
  openedApps.push(appMeta);

  appMeta.runtime.instance = new appMeta.RootComponent({ target });

  AppManager.fire('opened', appMeta, options);
  DriverManager.drivers.$App.fire('opened');
};

AppManager.close = async () => {
  if (__DEV__) log('Closing App');

  const currentApp = AppManager.getCurrentApp();

  if (currentApp) {
    AppManager.fire('closing', currentApp);
    DriverManager.drivers.$App.fire('closed');

    if (currentApp.runtime.instance) {
      AppManager.unbindGlobalEvents(currentApp);
      currentApp.runtime.instance.destroy();

      const appsEl = document.getElementById('apps-container');
      appsEl.removeChild(currentApp.runtime.target);

      delete currentApp.runtime;

      /** Remove the current app from the opened apps array */
      openedApps.pop();

      if (openedApps.length) {
        await AppManager.resume(AppManager.getCurrentApp());
      }

      AppManager.fire('closed', currentApp);
    } else if (__DEV__) {
      warn('App already closed');
    }
  }
};

export default AppManager;
