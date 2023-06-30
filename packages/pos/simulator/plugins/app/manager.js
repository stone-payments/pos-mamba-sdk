import EventTarget from '../../libs/EventTarget.js';
import { log, warn } from '../../libs/utils.js';
import extend from '../../../extend.js';
import { DriverManager } from '../index.js';

import initCollector from './includes/collector.js';
import initSuspension from './includes/suspension.js';

const AppManager = extend({}, initCollector, initSuspension, EventTarget());

/** Map of installed appds: app-slug -> app-obj */
const Apps = {};

/** Stack of opened apps. The current app is the last one. */
const openedApps = [];

AppManager.getApp = (slug) => Apps[slug];
AppManager.getInstalledApps = () => Apps;
AppManager.getOpenedApps = () => openedApps;
AppManager.getCurrentApp = () => openedApps[openedApps.length - 1];

const loadApp = (appMeta) => {
  AppManager.fire('loading');
  return appMeta.loader().then(({ default: App }) => {
    AppManager.fire('loaded');
    Apps[appMeta.manifest.slug].RootComponent = App;
  });
};

AppManager.installApp = ({ manifest, RootComponent, loader }) => {
  if (!Apps[manifest.slug]) {
    const appMeta = { manifest };

    if (loader != null) appMeta.loader = loader;
    if (RootComponent != null) appMeta.RootComponent = RootComponent;

    Apps[manifest.slug] = appMeta;

    AppManager.fire('appInstalled', appMeta);
  } else if (__DEV__) {
    warn(`Tried to install an already installed app with slug "${manifest.slug}"`);
  }

  return Apps[manifest.slug];
};

AppManager.open = async (appSlug, options = {}) => {
  /** First time opening an app */
  const appMeta = AppManager.getApp(appSlug);

  if (!appMeta.RootComponent) {
    await loadApp(appMeta);
  }

  AppManager.fire('opening', appMeta, options);

  if (__DEV__) log(`Opening App: ${appMeta.manifest.appName}`);

  const appsEl = document.getElementById('apps-container') || document.getElementById('app-root');

  if (!appsEl) {
    throw new Error('Apps container element (#apps-container or #app-root) not found.');
  }

  let target = appsEl;

  /** We support multiple apps only when the simulator view is loaded */
  if (appsEl.id === 'apps-container') {
    target = document.createElement('DIV');
    appsEl.appendChild(target);
  }

  const currentApp = AppManager.getCurrentApp();

  if (currentApp) {
    await AppManager.suspend(currentApp);
  }

  /**
   *  Runtime object must be created before instance initialization
   * because it already binds event listeners on instantiation.
   */
  appMeta.runtime = {
    target,
    collectedEvents: {},
  };
  /** Insert the most current app at the first index */
  openedApps.push(appMeta);

  appMeta.runtime.instance = new appMeta.RootComponent({ target });

  // add a app root reference for mamba-pkgs packages
  window.$MAMBA = appMeta.runtime.instance;

  /**
   * Since our app store is initialized once inside its module
   * and not along the app's constructor, we need to reset it to a
   * initial state after the app closes.
   *
   * If the app is supposed to be kept in the background, we assume
   * the app itself has some logic to reset its store.
   */
  if (!appMeta.manifest.keepInBackground) {
    const { store } = appMeta.runtime.instance;
    if (store) {
      const initialState = { ...store.get() };
      Object.keys(store._computed).forEach((computedKey) => {
        delete initialState[computedKey];
      });
      appMeta.runtime.store = { ref: store, initialState };
    }
  }

  AppManager.fire('opened', appMeta, options);
  DriverManager.drivers.$App.fire('opened');
};

AppManager.close = async () => {
  if (__DEV__) log('Closing App');

  const currentApp = AppManager.getCurrentApp();

  if (currentApp) {
    AppManager.fire('closing', currentApp);
    DriverManager.drivers.$App.fire('closed');

    const {
      manifest,
      runtime: { instance, target, store },
    } = currentApp;

    if (instance) {
      AppManager.unbindGlobalEvents(currentApp);
      instance.destroy();
      target.parentNode.removeChild(target);

      if (!manifest.keepInBackground && store) {
        store.ref.set(store.initialState);
      }

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
