import EventTarget from '../../libs/EventTarget.js';
import { log, warn } from '../../libs/utils.js';
import initEventCollector from './includes/eventCollector.js';
import extend from '../../../extend.js';
import { DriverManager } from '../index.js';

const AppManager = extend({}, initEventCollector, EventTarget());

const Apps = {};

const openedApps = [];

AppManager.getInstalledApps = () => Apps;
AppManager.getOpenedApps = () => openedApps;
AppManager.getCurrentApp = () => openedApps[0];

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

  const target = document.getElementById('app-root');

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

  /** Insert the most current app at the first index */
  openedApps.splice(0, 0, appMeta);

  appMeta.runtime.instance = new appMeta.RootComponent({ target });

  AppManager.fire('opened', appMeta, options);
  DriverManager.drivers.$App.fire('opened');
};

AppManager.close = () => {
  if (__DEV__) log('Closing App');

  const currentApp = AppManager.getCurrentApp();

  if (currentApp) {
    AppManager.fire('closing', currentApp);
    DriverManager.drivers.$App.fire('closed');

    if (currentApp.runtime.instance) {
      AppManager.unbindGlobalEvents(currentApp);
      currentApp.runtime.instance.destroy();

      delete currentApp.runtime;

      AppManager.fire('closed', currentApp);

      /** Remove the current app from the opened apps array */
      openedApps.splice(0, 1);
    } else if (__DEV__) {
      warn('App already closed');
    }
  }
};

export default AppManager;
