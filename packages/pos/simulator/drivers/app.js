import { AppManager, Registry } from '../index.js';

export const NAMESPACE = '$App';

export const SIGNALS = ['opened', 'closed'];

export const PERSISTENT_SETTINGS = {
  appKey: '',
};

export function setup(App) {
  App.doClose = () => AppManager.close();

  App.getAppKey = () => Registry.persistent.get().$App.appKey;

  App.isRunningOnDevice = () => false;
}
